"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for Payment
exports.PaymentSchema = new mongoose_1.default.Schema({
	receiver: { type: String, required: true },
	amount: { type: Number, required: true },
	sender: { type: String, required: true },
	comment: { type: String, required: true },
	date: { type: Date, required: true },
});
