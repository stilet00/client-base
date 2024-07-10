"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessAdminSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.BusinessAdminSchema = new mongoose_1.default.Schema({
	name: {
		type: String,
		required: [true, "First name is reqiured!"],
	},
	surname: {
		type: String,
		required: [true, "Last name is required!"],
	},
	email: {
		type: String,
		lowercase: true,
		required: false,
	},
});
