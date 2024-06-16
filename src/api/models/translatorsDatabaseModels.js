"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var BalanceDaySchema = new mongoose_1.default.Schema({
	dateTimeId: Date,
	translator: {
		type: mongoose_1.default.Schema.Types.ObjectId,
		ref: "Translator",
	},
	client: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Client" },
	statistics: {
		chats: Number,
		letters: Number,
		dating: Number,
		virtualGiftsSvadba: Number,
		virtualGiftsDating: Number,
		photoAttachments: Number,
		phoneCalls: Number,
		penalties: Number,
		comments: String,
		voiceMessages: Number,
	},
});
var SuspendedStatusSchema = new mongoose_1.default.Schema({
	status: Boolean,
	time: Date,
});
var PersonalPenaltiesSchema = new mongoose_1.default.Schema({
	translator: {
		type: mongoose_1.default.Schema.Types.ObjectId,
		ref: "Translator",
	},
	dateTimeId: Date,
	amount: Number,
	description: String,
});
var TranslatorSchema = new mongoose_1.default.Schema({
	name: {
		type: String,
		required: [true, "Please tell us your name!"],
	},
	surname: {
		type: String,
		required: [true, "Please tell us your name!"],
	},
	clients: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Client" }],
	statistics: [
		{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "BalanceDay" },
	],
	edited: Boolean,
	suspended: SuspendedStatusSchema,
	personalPenalties: [PersonalPenaltiesSchema],
	email: {
		type: String,
		lowercase: true,
		required: false,
	},
	password: {
		type: String,
		lowercase: true,
		required: false,
	},
	wantsToReceiveEmails: Boolean,
});
module.exports = {
	TranslatorSchema: TranslatorSchema,
	BalanceDaySchema: BalanceDaySchema,
	PersonalPenaltiesSchema: PersonalPenaltiesSchema,
};
