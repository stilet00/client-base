import mongoose from "mongoose";

export interface Statistics {
	chats: number;
	letters: number;
	dating: number;
	virtualGiftsSvadba: number;
	virtualGiftsDating: number;
	photoAttachments: number;
	phoneCalls: number;
	penalties: number;
	comments: string;
	voiceMessages: number;
}

export interface BalanceDay {
	dateTimeId: Date;
	translator: mongoose.Types.ObjectId;
	client: mongoose.Types.ObjectId;
	statistics: Statistics;
}

interface SuspendedStatus {
	status: boolean;
	time: Date;
}

export interface PersonalPenalty {
	translator: mongoose.Types.ObjectId;
	dateTimeId: Date;
	amount: number;
	description: string;
}

export interface Translator {
	_id?: string;
	name: string;
	surname: string;
	clients: mongoose.Types.ObjectId[];
	statistics: mongoose.Types.ObjectId[];
	edited: boolean;
	suspended: SuspendedStatus;
	personalPenalties: PersonalPenalty[];
	email: string;
	password: string;
	wantsToReceiveEmails: boolean;
}

const BalanceDaySchema = new mongoose.Schema<BalanceDay>({
	dateTimeId: Date,
	translator: { type: mongoose.Schema.Types.ObjectId, ref: "Translator" },
	client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
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

const SuspendedStatusSchema = new mongoose.Schema({
	status: Boolean,
	time: Date,
});

const PersonalPenaltiesSchema = new mongoose.Schema({
	translator: { type: mongoose.Schema.Types.ObjectId, ref: "Translator" },
	dateTimeId: Date,
	amount: Number,
	description: String,
});

const TranslatorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please tell us your name!"],
	},
	surname: {
		type: String,
		required: [true, "Please tell us your name!"],
	},
	clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
	statistics: [{ type: mongoose.Schema.Types.ObjectId, ref: "BalanceDay" }],
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
	TranslatorSchema,
	BalanceDaySchema,
	PersonalPenaltiesSchema,
};
