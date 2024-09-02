import { Statistics } from "../api/models/translatorsDatabaseModels";
import {
	calculatePercentDifference,
	calculateBalanceDaySum,
} from "./sharedFunctions";

const mockedStatistics: Statistics = {
	chats: 10,
	letters: 10,
	dating: 10,
	virtualGiftsSvadba: 10,
	virtualGiftsDating: 10,
	photoAttachments: 10,
	phoneCalls: 10,
	penalties: 10,
	comments: "Test comment for balance day",
	voiceMessages: 10,
};

enum ExpectedSums {
	SvadbaOnlySum = 50,
	DatingOnlySum = 10,
	BalanceDaySum = 70,
	PercentDiffPositive = 16.7,
	PercentDiffNegative = 20,
	PercentDiffZeroPrevious = 100,
	PercentDiffZeroCurrent = 100,
}

describe("calculateBalanceDaySum", () => {
	it("should calculate balance day sum correctly for onlySvadba", () => {
		const result = calculateBalanceDaySum(mockedStatistics, true);
		expect(result).toBe(ExpectedSums.SvadbaOnlySum);
	});

	it("should calculate balance day sum correctly for a specific category", () => {
		const result = calculateBalanceDaySum(mockedStatistics, false, "dating");
		expect(result).toBe(ExpectedSums.DatingOnlySum);
	});

	it("should calculate balance day sum correctly for all categories", () => {
		const result = calculateBalanceDaySum(mockedStatistics);
		expect(result).toBe(ExpectedSums.BalanceDaySum);
	});
});

describe("calculatePercentDifference", () => {
	it("should return correct percent difference for positive progress", () => {
		const result = calculatePercentDifference(120, 100);
		expect(result).toEqual(ExpectedSums.PercentDiffPositive);
	});

	it("should return correct percent difference for negative progress", () => {
		const result = calculatePercentDifference(80, 100);
		expect(result).toEqual(ExpectedSums.PercentDiffNegative);
	});

	it("should handle zero previousSum", () => {
		const result = calculatePercentDifference(0, 100);
		expect(result).toEqual(ExpectedSums.PercentDiffZeroPrevious);
	});

	it("should handle zero currentSum", () => {
		const result = calculatePercentDifference(100, 0);
		expect(result).toEqual(ExpectedSums.PercentDiffZeroCurrent);
	});
});
