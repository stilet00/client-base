import mongoose from "mongoose";

export interface BusinessAdmin {
	_id: string;
	name: string;
	surname: string;
	email: string;
}

export const BusinessAdminSchema = new mongoose.Schema<BusinessAdmin>({
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
		unique: true,
	},
});
