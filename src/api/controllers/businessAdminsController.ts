import type { Request, Response } from "express";
import mongoose, { type Query } from "mongoose";
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
		let { _id, email, name, surname } = req.body;
		email = email?.trim();
		name = name?.trim();
		surname = surname?.trim();
		if (!email || !name || !surname) {
			res.status(400).send({ error: "Invalid input data" });
			return;
		}
		const BusinessAdminModel = getCollections().collectionBusinessAdmins;

		if (_id) {
			const updatedAdmin = await BusinessAdminModel.findByIdAndUpdate(
				_id,
				{ email, name, surname },
				{ new: true, runValidators: true },
			);

			if (!updatedAdmin) {
				res.status(404).send({ error: "Business admin not found" });
				return;
			}

			res.status(200).send(updatedAdmin);
		} else {
			const newBusinessAdmin = new BusinessAdminModel({
				email,
				name,
				surname,
			});

			await newBusinessAdmin.save();
			res.status(201).send(newBusinessAdmin);
		}
	} catch (error: unknown) {
		if (error instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ error: error.message });
		} else if ((error as any).code === 11000) {
			res.status(409).send({ error: "Email already exists" });
		} else {
			console.error(error);
			res.status(500).send({ error: "Internal Server Error" });
		}
	}
};

export const deleteBusinessAdmin = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { id } = req.params;
		console.log(id);
		const BusinessAdminModel = getCollections().collectionBusinessAdmins;

		const result = await BusinessAdminModel.findByIdAndDelete(id);
		if (!result) {
			res.status(404).send({ error: "Business admin not found" });
			return;
		}

		res.status(200).send({ message: "Business admin deleted successfully" });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error.message);
		}
		res.sendStatus(500);
	}
};
