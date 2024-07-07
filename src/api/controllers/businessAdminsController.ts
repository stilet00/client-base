import type { Request, Response } from "express";
import { type DeleteResult, type MongoError, ObjectId } from "mongodb";
import mongoose, { type Query } from "mongoose";
import type { BusinessAdmin } from "../models/businessAdminsDatabaseModels";

const { getCollections } = require("../database/collections");

export const getAllBusinessAdmins = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const hasSearchQuery: boolean = !!req.query?.searchQuery;
		const query: Query<BusinessAdmin[], BusinessAdmin> =
			getCollections().collectionBusinessAdmins.find();

		const businessAdmins: BusinessAdmin[] = await query.exec();
		res.send(businessAdmins);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error.message);
		}
		res.sendStatus(500);
	}
};
