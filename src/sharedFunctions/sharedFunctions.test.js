"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sharedFunctions_1 = require("./sharedFunctions");
var mockedStatistics = {
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
var ExpectedSums;
(function (ExpectedSums) {
	ExpectedSums[(ExpectedSums["SvadbaOnlySum"] = 50)] = "SvadbaOnlySum";
	ExpectedSums[(ExpectedSums["DatingOnlySum"] = 10)] = "DatingOnlySum";
	ExpectedSums[(ExpectedSums["BalanceDaySum"] = 70)] = "BalanceDaySum";
	ExpectedSums[(ExpectedSums["PercentDiffPositive"] = 16.7)] =
		"PercentDiffPositive";
	ExpectedSums[(ExpectedSums["PercentDiffNegative"] = 20)] =
		"PercentDiffNegative";
	ExpectedSums[(ExpectedSums["PercentDiffZeroPrevious"] = 100)] =
		"PercentDiffZeroPrevious";
	ExpectedSums[(ExpectedSums["PercentDiffZeroCurrent"] = 100)] =
		"PercentDiffZeroCurrent";
})(ExpectedSums || (ExpectedSums = {}));
describe("calculateBalanceDaySum", function () {
	it("should calculate balance day sum correctly for onlySvadba", function () {
		var result = (0, sharedFunctions_1.calculateBalanceDaySum)(
			mockedStatistics,
			true,
		);
		expect(result).toBe(ExpectedSums.SvadbaOnlySum);
	});
	it("should calculate balance day sum correctly for a specific category", function () {
		var result = (0, sharedFunctions_1.calculateBalanceDaySum)(
			mockedStatistics,
			false,
			"dating",
		);
		expect(result).toBe(ExpectedSums.DatingOnlySum);
	});
	it("should calculate balance day sum correctly for all categories", function () {
		var result = (0, sharedFunctions_1.calculateBalanceDaySum)(
			mockedStatistics,
		);
		expect(result).toBe(ExpectedSums.BalanceDaySum);
	});
});
describe("calculatePercentDifference", function () {
	it("should return correct percent difference for positive progress", function () {
		var result = (0, sharedFunctions_1.calculatePercentDifference)(120, 100);
		expect(result).toEqual(ExpectedSums.PercentDiffPositive);
	});
	it("should return correct percent difference for negative progress", function () {
		var result = (0, sharedFunctions_1.calculatePercentDifference)(80, 100);
		expect(result).toEqual(ExpectedSums.PercentDiffNegative);
	});
	it("should handle zero previousSum", function () {
		var result = (0, sharedFunctions_1.calculatePercentDifference)(0, 100);
		expect(result).toEqual(ExpectedSums.PercentDiffZeroPrevious);
	});
	it("should handle zero currentSum", function () {
		var result = (0, sharedFunctions_1.calculatePercentDifference)(100, 0);
		expect(result).toEqual(ExpectedSums.PercentDiffZeroCurrent);
	});
});
