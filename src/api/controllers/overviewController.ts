import type { Request, Response } from "express";
import { calculateBalanceDaySum } from "../../sharedFunctions/sharedFunctions";
import type {
	BalanceDay,
	Translator,
} from "api/models/translatorsDatabaseModels";
import type { PaymentStatement } from "api/models/statementsDatabaseModels";
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

export const getOverviewData = async (req: Request, res: Response) => {
	try {
		const { selectedYear } = req.query;
		const BalanceDay = await getCollections().collectionBalanceDays;
		const Translator = await getCollections().collectionTranslators;
		const Client = await getCollections().collectionClients;
		const Payment = await getCollections().collectionStatements;

		const yearFilter = selectedYear || getMomentUTC().format("YYYY");
		const startOfYear = getMomentUTC(yearFilter, "YYYY")
			.startOf("year")
			.toISOString();
		const endOfYear = getMomentUTC(yearFilter, "YYYY")
			.endOf("year")
			.toISOString();

		const balanceDays = await BalanceDay.find({
			dateTimeId: {
				$gte: startOfYear,
				$lte: endOfYear,
			},
		}).exec();

		const yearTotal = balanceDays.reduce((sum: number, day: BalanceDay) => {
			return sum + calculateBalanceDaySum(day.statistics);
		}, 0);

		const startOfMonth = getMomentUTC().startOf("month").toISOString();
		const endOfCurrentDay = getMomentUTC().endOf("day").toISOString();
		const currentMonthBalanceDays = await BalanceDay.find({
			dateTimeId: {
				$gte: startOfMonth,
				$lte: endOfCurrentDay,
			},
		}).exec();

		const currentMonthTotal = currentMonthBalanceDays.reduce(
			(sum: number, day: BalanceDay) => {
				return sum + calculateBalanceDaySum(day.statistics);
			},
			0,
		);
		const svadbaMonthTotal = currentMonthBalanceDays.reduce(
			(sum: number, day: BalanceDay) => {
				return sum + calculateBalanceDaySum(day.statistics, true);
			},
			0,
		);

		const startOfPreviousMonth = getMomentUTC()
			.subtract(1, "month")
			.startOf("month")
			.toISOString();
		const endOfPreviousMonth = getMomentUTC()
			.subtract(1, "month")
			.endOf("month")
			.toISOString();
		const previousMonthBalanceDays = await BalanceDay.find({
			dateTimeId: {
				$gte: startOfPreviousMonth,
				$lte: endOfPreviousMonth,
			},
		}).exec();

		const previousMonthTotal = previousMonthBalanceDays.reduce(
			(sum: number, day: BalanceDay) => {
				return sum + calculateBalanceDaySum(day.statistics);
			},
			0,
		);
		const svadbaPreviousMonthTotal = previousMonthBalanceDays.reduce(
			(sum: number, day: BalanceDay) => {
				return sum + calculateBalanceDaySum(day.statistics, true);
			},
			0,
		);

		const calculatePercentageDifference = (
			current: number,
			previous: number,
		) => (previous === 0 ? 0 : ((current - previous) / previous) * 100);

		const monthPercentageDifference = calculatePercentageDifference(
			currentMonthTotal,
			previousMonthTotal,
		);

		const svadbaPercentageDifference = calculatePercentageDifference(
			svadbaMonthTotal,
			svadbaPreviousMonthTotal,
		);

		const datingMonthTotal = currentMonthTotal - svadbaMonthTotal;
		const datingPreviousMonthTotal =
			previousMonthTotal - svadbaPreviousMonthTotal;
		const datingPercentageDifference = calculatePercentageDifference(
			datingMonthTotal,
			datingPreviousMonthTotal,
		);

		const translators = await Translator.find({
			"suspended.status": false,
		}).exec();
		const activeTranslators = translators.filter(
			(translator: Translator) => !translator.suspended.status,
		).length;

		const clientsCount = await Client.countDocuments().exec();

		const payments = await Payment.find({
			date: {
				$gte: startOfYear,
				$lte: endOfYear,
			},
		}).exec();
		const paymentSums: CategorySum[] = await Payment.aggregate([
			{
				$match: {
					date: {
						$gte: new Date(`${selectedYear}-01-01T00:00:00.000Z`),
						$lte: new Date(`${selectedYear}-12-31T23:59:59.999Z`),
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

		const totalPayments = payments.reduce(
			(sum: number, payment: PaymentStatement) => sum + payment.amount,
			0,
		);

		const totalProfit =
			yearTotal - Math.floor(yearTotal * 0.45) - totalPayments;

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

		const overviewData: OverviewData & CategorySumsObject = {
			clients: clientsCount,
			activeTranslators,
			monthTotal: currentMonthTotal.toFixed(0),
			svadbaMonthTotal: svadbaMonthTotal.toFixed(0),
			previousMonthTotal: previousMonthTotal.toFixed(0),
			svadbaPreviousMonthTotal: svadbaPreviousMonthTotal.toFixed(0),
			yearTotal: yearTotal.toFixed(0),
			totalPayments,
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
