import mongoose, { type Schema, type Document } from "mongoose";
export interface PaymentStatement extends Document {
	receiver: string;
	amount: number;
	sender: string;
	comment: string;
	date: Date;
}

export const PaymentSchema: Schema = new mongoose.Schema<PaymentStatement>({
	receiver: { type: String, required: true },
	amount: { type: Number, required: true },
	sender: { type: String, required: true },
	comment: { type: String, required: true },
	date: { type: Date, required: true },
});
