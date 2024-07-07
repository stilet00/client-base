import mongoose from "mongoose";

export interface BusinessAdmin {
	_id?: string;
	name: string;
	surname: string;
	active: boolean;
	email: string;
}

export const BusinessAdminSchema = new mongoose.Schema<BusinessAdmin>({
	name: {
		type: String,
		required: [true, "Please tell us your name!"],
	},
	surname: {
		type: String,
		required: [true, "Please tell us your name!"],
	},
	email: {
		type: String,
		lowercase: true,
		required: false,
	},
	active: {
		type: Boolean,
		required: false,
	},
});
