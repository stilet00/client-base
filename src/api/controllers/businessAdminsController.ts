import type { Request, Response } from "express";
import { type Query } from "mongoose";
import { type BusinessAdmin } from "../models/businessAdminsDatabaseModels";

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

export const saveBusinessAdmin = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { email, name, surname } = req.body;
		if (!email || !name || !surname) {
			res.status(400).send({ error: "Invalid input data" });
			return;
		}
		const BusinessAdminModel = await getCollections().collectionBusinessAdmins;
		const newBusinessAdmin = new BusinessAdminModel({
			email,
			name,
			surname,
		});
		await newBusinessAdmin.save();
		res.status(201).send(newBusinessAdmin);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error.message);
		}
		res.sendStatus(500);
	}
};
