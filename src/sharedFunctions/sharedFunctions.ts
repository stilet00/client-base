import moment from "moment";
import { localStorageTokenKey } from "../constants/constants";
import {
	BalanceDay,
	PersonalPenalty,
	Statistics,
} from "../api/models/translatorsDatabaseModels";

export function calculateBalanceDaySum(
	targetObject: Statistics,
	onlySvadba = false,
	category?: Exclude<keyof Statistics, "comments">,
) {
	if (onlySvadba) {
		const svadbaObject = {
			...targetObject,
			dating: 0,
			virtualGiftsDating: 0,
		};

		const svadbaSum = Object.values(svadbaObject).reduce(
			(sum: number, current) => {
				return typeof current === "number" ? sum + current : sum;
			},
			0,
		);

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
}

export function getTotalDaysOfMonth(
	year: string,
	monthNumber: number,
): number[] {
	const stringMonth = monthNumber < 9 ? "0" + monthNumber : monthNumber;
	let totalDays = [];
	for (
		let i = 1;
		i <= getMomentUTC(year + "-" + stringMonth, "YYYY-MM").daysInMonth();
		i++
	) {
		totalDays.push(i);
	}
	return totalDays;
}

export const calculateTranslatorMonthTotal = (
	balanceDays: BalanceDay[],
	forFullMonth = true,
	onlySvadba = false,
	category?: Exclude<keyof Statistics, "comments">,
) => {
	let total;
	if (forFullMonth) {
		total = balanceDays?.reduce((sum: number, current) => {
			return (
				sum + calculateBalanceDaySum(current.statistics, onlySvadba, category)
			);
		}, 0);
	} else {
		const balanceDaysForCurrentPartOFMonth = balanceDays?.filter(
			({ dateTimeId }) =>
				getMomentUTC(dateTimeId).isSameOrBefore(getMomentUTC(), "day"),
		);
		total = balanceDaysForCurrentPartOFMonth?.reduce((sum, current) => {
			return (
				sum + calculateBalanceDaySum(current.statistics, onlySvadba, category)
			);
		}, 0);
	}

	return getNumberWithHundreds(total);
};

export function getStringMonthNumber(monthNumber: number): string {
	return monthNumber < 10 ? "0" + monthNumber : String(monthNumber);
}

export function getSumFromArray(arrayOfNumbers: number[]): number {
	return arrayOfNumbers.reduce((sum, current) => sum + current, 0);
}

export function getMiddleValueFromArray(arrayOfNumbers: number[]) {
	const sum = getSumFromArray(arrayOfNumbers);
	if (arrayOfNumbers.length === 0) {
		return 0;
	}
	return Math.round(sum / arrayOfNumbers.length);
}
export function getClientsRating(MiddleMonthSum = 0) {
	return MiddleMonthSum >= 80
		? 5
		: MiddleMonthSum >= 60
			? 4
			: MiddleMonthSum >= 40
				? 3
				: MiddleMonthSum >= 20
					? 2
					: MiddleMonthSum >= 10
						? 1
						: 0;
}

export function calculatePercentDifference(
	currentSum: number,
	previousSum: number,
): number {
	if (currentSum === 0 && previousSum === 0) {
		return 0;
	}

	const difference =
		currentSum > previousSum
			? ((currentSum - previousSum) * 100) / currentSum
			: ((previousSum - currentSum) * 100) / previousSum;

	if (isNaN(difference)) {
		return 0;
	}

	const result = parseFloat(difference.toFixed(1));

	return result % 1 === 0 ? Math.round(result) : result;
}

export function getNumberWithHundreds(number: number) {
	return Number(number?.toFixed(2));
}

export function saveUserIdTokenToLocalStorage(idToken: string) {
	window.localStorage.setItem(localStorageTokenKey, idToken);
}

export const getMomentUTC = (
	date: string | undefined | Date = undefined,
	format: string | undefined = undefined,
) => moment(date, format).utc();

export function getStartOfPreviousDayInUTC() {
	return getMomentUTC().subtract(1, "day").startOf("day");
}

export function convertDateToIsoString(selectedDate: string) {
	return moment(selectedDate).utc().startOf("day").format();
}

export const getCurrentMonthPenalties = (
	penalties: PersonalPenalty[],
): string => {
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
