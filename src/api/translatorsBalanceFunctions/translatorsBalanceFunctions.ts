import {
	Statistics,
	PersonalPenalty,
} from "../models/translatorsDatabaseModels";

const { getMomentUTC } = require("../utils/utils");

const calculateBalanceDaySum = (
	targetObject: Statistics,
	onlySvadba: boolean = false,
	category?: Exclude<keyof Statistics, "comments">,
): number => {
	if (onlySvadba) {
		const svadbaObject = {
			...targetObject,
			dating: 0,
			virtualGiftsDating: 0,
		};

		const arrayOfNumberValues: number[] = Object.values(svadbaObject).filter(
			(value): value is number => typeof value === "number",
		) as number[];

		const svadbaSum = arrayOfNumberValues.reduce((sum, current) => {
			return typeof current === "number" ? sum + current : sum;
		}, 0);

		return svadbaSum - svadbaObject.penalties * 2;
	} else if (category) {
		const categorizedObject = {
			[category]: targetObject[category],
		};
		const categorySum = Object.values(categorizedObject).reduce(
			(sum, current) => {
				return typeof current === "number" ? sum + current : sum;
			},
			0,
		);
		return categorySum;
	} else {
		const arrayToSum = Object.values(targetObject);
		const sumResult = arrayToSum.reduce((sum, current) => {
			return typeof current === "number" ? sum + current : sum;
		}, 0);
		return sumResult - targetObject.penalties * 2;
	}
};

const calculatePercentDifference = (
	currentSum: number,
	previousSum: number,
): { progressIsPositive: boolean; value: number } => {
	const difference =
		currentSum > previousSum
			? ((currentSum - previousSum) * 100) / currentSum
			: ((previousSum - currentSum) * 100) / previousSum;
	const result: number = isNaN(difference)
		? 0
		: parseFloat(difference.toFixed(1));
	if (result % 1 === 0) {
		return {
			progressIsPositive: currentSum > previousSum,
			value: parseFloat(result.toFixed(0)),
		};
	}
	return {
		progressIsPositive: currentSum > previousSum,
		value: result,
	};
};

const getCurrentMonthPenalties = (penalties: PersonalPenalty[]): string => {
	if (!penalties) return "0";
	const currentDate = getMomentUTC();
	const onlyCurMonthPenalties = penalties.filter(({ dateTimeId }) =>
		getMomentUTC(dateTimeId).isSame(currentDate, "month"),
	);
	const totalPenaltiesForCurMonth = onlyCurMonthPenalties.reduce(
		(acc, currentPenalty) => {
			const amount = currentPenalty?.amount || 0;
			return acc + amount;
		},
		0,
	);
	return totalPenaltiesForCurMonth.toString();
};

module.exports = {
	calculatePercentDifference,
	getCurrentMonthPenalties,
	calculateBalanceDaySum,
};
