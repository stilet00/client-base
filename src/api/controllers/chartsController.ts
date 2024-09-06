import { Request, Response } from "express";
import moment from "moment";
const { getCollections } = require("../database/collections");
const {
	getNumberWithHundreds,
} = require("../../sharedFunctions/sharedFunctions");

const { getMomentUTC } = require("../utils/utils");

interface RawMonthData {
	year: string;
	month: string;
	days: number[];
	values: (number | null)[];
}

export const getCharts = async (req: Request, res: Response): Promise<void> => {
	try {
		const { yearFilter } = req.query;
		const BalanceDay = await getCollections().collectionBalanceDays;

		let momentFromYearFilter = getMomentUTC();
		if (yearFilter) {
			momentFromYearFilter = getMomentUTC(yearFilter as string, "YYYY");
		}

		const startOfYearFilter = momentFromYearFilter.startOf("year").toDate();
		const endOfYearFilter = momentFromYearFilter.endOf("year").toDate();

		const rawResults: RawMonthData[] = await BalanceDay.aggregate([
			{
				$match: {
					dateTimeId: {
						$gte: startOfYearFilter,
						$lte: endOfYearFilter,
					},
				},
			},
			{
				$group: {
					_id: {
						year: { $year: "$dateTimeId" },
						month: { $month: "$dateTimeId" },
						day: { $dayOfMonth: "$dateTimeId" },
					},
					totalSum: {
						$sum: {
							$subtract: [
								{
									$add: [
										"$statistics.chats",
										"$statistics.letters",
										"$statistics.dating",
										"$statistics.virtualGiftsSvadba",
										"$statistics.virtualGiftsDating",
										"$statistics.photoAttachments",
										"$statistics.phoneCalls",
										"$statistics.voiceMessages",
									],
								},
								"$statistics.penalties",
							],
						},
					},
				},
			},
			{
				$group: {
					_id: { year: "$_id.year", month: "$_id.month" },
					days: { $push: "$_id.day" },
					values: { $push: "$totalSum" },
				},
			},
			{
				$project: {
					year: "$_id.year",
					month: { $toString: "$_id.month" },
					days: 1,
					values: 1,
				},
			},
			{ $sort: { year: -1, month: -1 } },
		]);

		const yearChartsArray: RawMonthData[] = rawResults.map(
			(monthData: RawMonthData) => {
				const year = monthData.year.toString();
				const month = monthData.month;
				const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();

				const fullDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
				const fullValues: (number | null)[] = Array(daysInMonth).fill(null);

				monthData.days.forEach((day: number, index: number) => {
					const value = monthData.values[index];
					const dayIndex = fullDays.indexOf(day);
					if (dayIndex !== -1) {
						fullValues[dayIndex] = getNumberWithHundreds(value);
					}
				});

				return {
					year,
					month,
					days: fullDays,
					values: fullValues,
				};
			},
		);

		res.send(yearChartsArray);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
		res.sendStatus(500);
	}
};
