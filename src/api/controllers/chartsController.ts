import { Request, Response } from "express";
import moment from "moment";
const { getCollections } = require("../database/collections");
const {
	calculateBalanceDaySum,
	getNumberWithHundreds,
} = require("../../sharedFunctions/sharedFunctions");
import { DEFAULT_MONTH_CHART } from "../../constants/constants";
import { BalanceDay } from "../models/translatorsDatabaseModels";

const { getMomentUTC } = require("../utils/utils");

export const getCharts = async (req: Request, res: Response): Promise<void> => {
	try {
		const { yearFilter, monthFilter } = req.query;

		const BalanceDay = await getCollections().collectionBalanceDays;
		const query: Record<string, any> = {};

		if (yearFilter) {
			const momentFromYearFilter = getMomentUTC(yearFilter as string, "YYYY");
			const startOfYearFilter = momentFromYearFilter
				.startOf("year")
				.toISOString();
			const endOfYearFilter = momentFromYearFilter.endOf("year").toISOString();
			query.dateTimeId = {
				$gte: startOfYearFilter,
				$lte: endOfYearFilter,
			};
		}

		if (monthFilter && typeof monthFilter === "string") {
			const [startMonth, endMonth] = monthFilter.split("-").map(Number);
			const year = yearFilter
				? getMomentUTC(yearFilter as string, "YYYY").year()
				: getMomentUTC().year();
			const startOfMonthFilter = getMomentUTC({
				year,
				month: startMonth - 1,
			})
				.startOf("month")
				.toISOString();
			const endOfMonthFilter = getMomentUTC({
				year,
				month: (endMonth || startMonth) - 1,
			})
				.endOf("month")
				.toISOString();

			if (!query.dateTimeId) {
				query.dateTimeId = {};
			}
			query.dateTimeId.$gte = startOfMonthFilter;
			query.dateTimeId.$lte = endOfMonthFilter;
		}

		const balanceDays: BalanceDay[] = await BalanceDay.find(query)
			.lean()
			.exec();

		const yearChartsArray: any[] = [];
		for (let monthCount = 1; monthCount <= 12; monthCount++) {
			const defaultMonth = new DEFAULT_MONTH_CHART(
				yearFilter as string,
				monthCount,
			);

			const stringMonth = defaultMonth.month;
			const daysInMonth = moment(yearFilter + "-" + stringMonth, "YYYY-MM")
				.hours(12)
				.utc()
				.daysInMonth();

			for (let dayCount = 1; dayCount <= daysInMonth; dayCount++) {
				const currentDayDate = moment(
					`${dayCount}-${monthCount}-${yearFilter}`,
					"D-M-YYYY",
				)
					.hours(12)
					.utc()
					.format();

				const arrayOfBalanceDayForCurrentDate = balanceDays.filter(
					(balanceDay) =>
						getMomentUTC(balanceDay.dateTimeId).isSame(currentDayDate, "day"),
				);

				const daySum = arrayOfBalanceDayForCurrentDate.reduce(
					(sum, current) => {
						return sum + calculateBalanceDaySum(current.statistics);
					},
					0,
				);

				if (daySum) {
					defaultMonth.values[dayCount - 1] = getNumberWithHundreds(daySum);
				}
			}

			if (
				defaultMonth.values.reduce((sum, current) => {
					return sum + Number(current);
				}, 0)
			) {
				yearChartsArray.unshift(defaultMonth);
			}
		}
		res.send(yearChartsArray);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
		res.sendStatus(500);
	}
};
