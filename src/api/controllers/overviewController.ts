import type { Request, Response } from "express";
import { calculateBalanceDaySum } from "../../sharedFunctions/sharedFunctions";
import type { BalanceDay } from "api/models/translatorsDatabaseModels";
import { getCollections } from "../database/collections";

const { getMomentUTC } = require("../utils/utils");

interface OverviewData {
	clients: number;
	activeTranslators: number;
	monthTotal: string;
	svadbaMonthTotal: string;
	previousMonthTotal: string;
	svadbaPreviousMonthTotal: string;
	yearTotal: string;
	totalPayments: string;
	totalProfit: string;
	clientsSalary: string;
	paymentToScout: string;
	paymentToBot: string;
	paymentToTranslator: string;
	monthPercentageDifference: number;
	svadbaPercentageDifference: number;
	datingPercentageDifference: number;
}

interface CategorySum {
	_id: string;
	totalAmount: number;
}

interface CategorySumsObject {
	clientsSalary: string;
	paymentToScout: string;
	paymentToBot: string;
	paymentToTranslator: string;
}

const getBalanceDaysForYear = async (yearFilter: string) => {
	const BalanceDay = await getCollections().collectionBalanceDays;
	const startOfYear = getMomentUTC(yearFilter, "YYYY")
		.startOf("year")
		.toISOString();
	const endOfYear = getMomentUTC(yearFilter, "YYYY")
		.endOf("year")
		.toISOString();

	return await BalanceDay.find({
		dateTimeId: { $gte: startOfYear, $lte: endOfYear },
	}).exec();
};

const calculatePercentageDifference = (current: number, previous: number) => {
	return previous === 0 ? 0 : ((current - previous) / previous) * 100;
};

const getPaymentSums = async (year: string) => {
	const Payment = await getCollections().collectionStatements;

	const paymentSums: CategorySum[] = await Payment.aggregate([
		{
			$match: {
				date: {
					$gte: new Date(`${year}-01-01T00:00:00.000Z`),
					$lte: new Date(`${year}-12-31T23:59:59.999Z`),
				},
			},
		},
		{
			$group: {
				_id: "$comment",
				totalAmount: { $sum: "$amount" },
			},
		},
	]).exec();

	const totalPayments = paymentSums.reduce(
		(sum: number, payment: CategorySum) => sum + payment.totalAmount,
		0,
	);

	const categorySums: CategorySumsObject = paymentSums.reduce(
		(acc, payment: CategorySum) => {
			switch (payment._id) {
				case "salary":
					acc.clientsSalary = payment.totalAmount.toFixed(0);
					break;
				case "Payment to scout":
					acc.paymentToScout = payment.totalAmount.toFixed(0);
					break;
				case "Payment to bot":
					acc.paymentToBot = payment.totalAmount.toFixed(0);
					break;
				case "Payment to translator":
					acc.paymentToTranslator = payment.totalAmount.toFixed(0);
					break;
			}
			return acc;
		},
		{
			clientsSalary: "0",
			paymentToScout: "0",
			paymentToBot: "0",
			paymentToTranslator: "0",
		},
	);

	return { totalPayments, categorySums };
};

const calculateMonthTotal = async (monthOffset = 0) => {
	const BalanceDay = await getCollections().collectionBalanceDays;
	const startOfMonth = getMomentUTC()
		.subtract(monthOffset, "month")
		.startOf("month")
		.toISOString();
	const endOfMonth = getMomentUTC()
		.subtract(monthOffset, "month")
		.endOf("month")
		.toISOString();

	const balanceDays = await BalanceDay.find({
		dateTimeId: { $gte: startOfMonth, $lte: endOfMonth },
	}).exec();

	const monthTotal = balanceDays.reduce(
		(sum: number, day: BalanceDay) =>
			sum + calculateBalanceDaySum(day.statistics),
		0,
	);

	const svadbaMonthTotal = balanceDays.reduce(
		(sum: number, day: BalanceDay) =>
			sum + calculateBalanceDaySum(day.statistics, true),
		0,
	);

	return { monthTotal, svadbaMonthTotal };
};

export const getOverviewData = async (req: Request, res: Response) => {
	try {
		const { selectedYear } = req.query;
		const yearFilter = selectedYear || getMomentUTC().format("YYYY");

		const balanceDays = await getBalanceDaysForYear(yearFilter);
		const yearTotal = balanceDays.reduce(
			(sum: number, day: BalanceDay) =>
				sum + calculateBalanceDaySum(day.statistics),
			0,
		);

		const { monthTotal: currentMonthTotal, svadbaMonthTotal } =
			await calculateMonthTotal();
		const {
			monthTotal: previousMonthTotal,
			svadbaMonthTotal: svadbaPreviousMonthTotal,
		} = await calculateMonthTotal(1);

		const monthPercentageDifference = calculatePercentageDifference(
			currentMonthTotal,
			previousMonthTotal,
		);
		const svadbaPercentageDifference = calculatePercentageDifference(
			svadbaMonthTotal,
			svadbaPreviousMonthTotal,
		);
		const datingPercentageDifference = calculatePercentageDifference(
			currentMonthTotal - svadbaMonthTotal,
			previousMonthTotal - svadbaPreviousMonthTotal,
		);

		const Translator = await getCollections().collectionTranslators;
		const Client = await getCollections().collectionClients;
		const translators = await Translator.find({
			"suspended.status": false,
		}).exec();
		const clientsCount = await Client.countDocuments().exec();
		const activeTranslators = translators.length;

		const { totalPayments, categorySums } = await getPaymentSums(yearFilter);

		const totalProfit =
			yearTotal - Math.floor(yearTotal * 0.45) - totalPayments;

		const overviewData: OverviewData & CategorySumsObject = {
			clients: clientsCount,
			activeTranslators,
			monthTotal: currentMonthTotal.toFixed(0),
			svadbaMonthTotal: svadbaMonthTotal.toFixed(0),
			previousMonthTotal: previousMonthTotal.toFixed(0),
			svadbaPreviousMonthTotal: svadbaPreviousMonthTotal.toFixed(0),
			yearTotal: yearTotal.toFixed(0),
			totalPayments: totalPayments.toFixed(0),
			totalProfit: totalProfit.toFixed(0),
			monthPercentageDifference: Math.round(monthPercentageDifference),
			svadbaPercentageDifference: Math.round(svadbaPercentageDifference),
			datingPercentageDifference: Math.round(datingPercentageDifference),
			...categorySums,
		};

		res.status(200).json(overviewData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
