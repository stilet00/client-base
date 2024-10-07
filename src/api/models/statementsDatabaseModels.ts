import mongoose, { type Schema, type Document } from "mongoose";

// Define the Payment interface (type) for TypeScript
export interface PaymentStatement extends Document {
	receiver: string;
	amount: number;
	sender: string;
	comment: string;
	date: Date;
}

// Define the schema for Payment
export const PaymentSchema: Schema = new mongoose.Schema({
	receiver: { type: String, required: true },
	amount: { type: Number, required: true },
	sender: { type: String, required: true },
	comment: { type: String, required: true },
	date: { type: Date, required: true },
});
