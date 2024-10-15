const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const { getCollections } = require("../database/collections");
const {
	calculateBalanceDaySum,
	getClientsRating,
	calculatePercentDifference,
} = require("../../sharedFunctions/sharedFunctions");
const { getMomentUTC } = require("../utils/utils");
const sharp = require("sharp");

const clientImageConverter = async (image) => {
	try {
		const format = "jpeg";
		const resizedImageBuffer = await sharp(
			Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64"),
		)
			.resize(300, 300, { fit: "inside", withoutEnlargement: true })
			.toFormat("jpeg")
			.toBuffer();

		const resizedImageBase64 = `data:image/${format};base64,${resizedImageBuffer.toString(
			"base64",
		)}`;
		return resizedImageBase64;
	} catch (err) {
		return image;
	}
};
const getAllClients = async (request, response) => {
	try {
		const noImageRequest = !!request.query?.noImageParams;
		const shouldFillTranslators = !!request.query?.shouldFillTranslators;
		const searchQuery = request.query?.searchQuery || "";
		let queryCondition = {};
		if (searchQuery) {
			queryCondition = {
				$or: [
					{ name: { $regex: searchQuery, $options: "i" } },
					{ surname: { $regex: searchQuery, $options: "i" } },
				],
			};
		}

		let query = getCollections().collectionClients.find(queryCondition);

		if (noImageRequest) {
			query = query.select("-image");
		}
		if (shouldFillTranslators) {
			query = query.populate("translators");
		}

		const clients = await query.exec();
		response.send(clients);
	} catch (error) {
		console.error(error);
		response.sendStatus(500);
	}
};

const addNewClient = async (request, response, next) => {
	try {
		if (!request.body) {
			return response.status(400).send("Ошибка при загрузке клиентки");
		}

		let { image } = request.body;
		if (!!image) {
			image = await clientImageConverter(image);
		}

		const newClientDataWithResizedImage = {
			...request.body,
			image: image ?? "",
		};

		const Client = await getCollections().collectionClients;
		const newClient = new Client(newClientDataWithResizedImage);
		const validationError = newClient.validateSync();
		if (validationError) {
			console.error("Validation failed:", validationError);
			return response.status(400).send("Validation failed");
		}
		const result = await newClient.save();

		response.status(200).send(result._id);
	} catch (error) {
		console.error(error);
		response.status(500).send("Failed to add client");
	}
};

const updateClient = async (request, response) => {
	try {
		if (!request.body) {
			return response.sendStatus(400);
		}
		const {
			image,
			name,
			surname,
			bankAccount,
			instagramLink,
			suspended,
			svadba,
			dating,
		} = request.body;

		const resizedImage = await clientImageConverter(image);

		const Client = await getCollections().collectionClients;
		const newClient = new Client({
			name,
			surname,
			bankAccount,
			instagramLink,
			suspended,
			image: resizedImage,
			svadba: {
				login: svadba.login,
				password: svadba.password,
			},
			dating: {
				login: dating.login,
				password: dating.password,
			},
		});
		const validationError = newClient.validateSync();
		if (validationError) {
			console.error("Validation failed:", validationError);
			return response.status(400).send("Validation failed");
		}
		const result = await Client.updateOne(
			{ _id: new mongoose.Types.ObjectId(request.params.id) },
			{
				$set: {
					name,
					surname,
					bankAccount,
					instagramLink,
					suspended,
					image: resizedImage,
					svadba: {
						login: svadba.login,
						password: svadba.password,
					},
					dating: {
						login: dating.login,
						password: dating.password,
					},
				},
			},
		);
		if (!result.acknowledged) {
			return response.sendStatus(404);
		}
		const message = `Клиента ${name} ${surname} успешно обновлена`;
		response.send(message);
	} catch (error) {
		console.error(error);
		response.sendStatus(500);
	}
};

const fetchClientsData = async () => {
	const Client = await getCollections().collectionClients;
	return await Client.find().populate("translators").exec();
};

const fetchBalanceDaysForClients = async () => {
	const BalanceDay = await getCollections().collectionBalanceDays;
	return await BalanceDay.find().exec();
};

const fetchPayments = async () => {
	const Payment = await getCollections().collectionStatements;
	return await Payment.find().exec();
};

const calculateTotalAmount = (balanceDays) => {
	return balanceDays.reduce(
		(sum, bd) =>
			Number.parseFloat(
				(sum + calculateBalanceDaySum(bd.statistics)).toFixed(2),
			),
		0,
	);
};

const getClientsOverviewData = async (req, res) => {
	try {
		const clients = await fetchClientsData();
		const balanceDays = await fetchBalanceDaysForClients();
		const payments = await fetchPayments();
		const clientProfits = clients.map((client) => {
			const clientBalanceDays = balanceDays.filter((bd) => {
				return `${bd.client}` === `${client._id}`;
			});

			const currentMonthBalanceDays = clientBalanceDays.filter((bd) =>
				getMomentUTC(bd.dateTimeId).isSame(getMomentUTC(), "month"),
			);
			const previousMonthBalanceDays = clientBalanceDays.filter((bd) =>
				getMomentUTC(bd.dateTimeId).isSame(
					getMomentUTC().subtract(1, "month"),
					"month",
				),
			);
			const twoMonthBeforeBalanceDays = clientBalanceDays.filter((bd) =>
				getMomentUTC(bd.dateTimeId).isSame(
					getMomentUTC().subtract(2, "month"),
					"month",
				),
			);

			const currentMonthTotalAmount = calculateTotalAmount(
				currentMonthBalanceDays,
			);
			const previousMonthTotalAmount = calculateTotalAmount(
				previousMonthBalanceDays,
			);
			const twoMonthBeforeAmount = calculateTotalAmount(
				twoMonthBeforeBalanceDays,
			);

			const daysInCurrentMonth = getMomentUTC().date();
			const daysInPreviousMonth = getMomentUTC()
				.subtract(1, "month")
				.daysInMonth();

			const middleMonthSum = Number.parseFloat(
				(currentMonthTotalAmount / daysInCurrentMonth).toFixed(2),
			);
			const previousMiddleMonthSum = Number.parseFloat(
				(previousMonthTotalAmount / daysInPreviousMonth).toFixed(2),
			);

			const currentYearBalanceDays = clientBalanceDays.filter((bd) =>
				getMomentUTC(bd.dateTimeId).isSame(getMomentUTC(), "year"),
			);
			const previousYearBalanceDays = clientBalanceDays.filter((bd) =>
				getMomentUTC(bd.dateTimeId).isSame(
					getMomentUTC().subtract(1, "year"),
					"year",
				),
			);
			const currentYearProfit = calculateTotalAmount(currentYearBalanceDays);
			const previousYearProfit = calculateTotalAmount(previousYearBalanceDays);
			const allYearsProfit = calculateTotalAmount(clientBalanceDays);
			return {
				clientId: client._id,
				currentYearProfit,
				previousYearProfit,
				allYearsProfit,
				currentMonthTotalAmount,
				previousMonthTotalAmount,
				twoMonthBeforeAmount,
				middleMonthSum,
				previousMiddleMonthSum,
			};
		});

		const clientPayments = clients.map((client) => {
			const paymentsForClient = payments.filter(
				(payment) => payment.receiverID === client._id,
			);
			const totalPayments = paymentsForClient.reduce(
				(sum, payment) => sum + payment.amount,
				0,
			);

			return {
				clientId: client._id,
				totalPayments,
			};
		});

		const responseData = clients
			.map((client) => {
				const clientProfit = clientProfits.find(
					(cp) => cp.clientId === client._id,
				);
				const clientPayment = clientPayments.find(
					(cp) => cp.clientId === client._id,
				);

				return {
					_id: client._id,
					name: client.name,
					surname: client.surname,
					bankAccount: client.bankAccount || "PayPal",
					svadba: client.svadba || { login: "", password: "" },
					dating: client.dating || { login: "", password: "" },
					instagramLink: client.instagramLink
						? `https://www.instagram.com/${client.instagramLink}`
						: "",
					image: client.image || null,
					suspended: client.suspended || false,
					currentYearProfit: clientProfit?.currentYearProfit || 0,
					previousYearProfit: clientProfit?.previousYearProfit || 0,
					allYearsProfit: clientProfit?.allYearsProfit || 0,
					totalPayments: clientPayment?.totalPayments || 0,
					currentMonthTotalAmount: clientProfit?.currentMonthTotalAmount || 0,
					previousMonthTotalAmount: clientProfit?.previousMonthTotalAmount || 0,
					twoMonthBeforeAmount: clientProfit?.twoMonthBeforeAmount || 0,
					translators: client.translators || [],
					rating: getClientsRating(clientProfit?.middleMonthSum || 0),
					middleMonthSum: clientProfit?.middleMonthSum || 0,
					previousMiddleMonthSum: clientProfit?.previousMiddleMonthSum || 0,
					monthProgressPercent: calculatePercentDifference(
						clientProfit?.middleMonthSum || 0,
						clientProfit?.previousMiddleMonthSum || 0,
					),
				};
			})
			.sort((a, b) => b.currentMonthTotalAmount - a.currentMonthTotalAmount);
		res.status(200).json(responseData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	getAllClients,
	addNewClient,
	updateClient,
	getClientsOverviewData,
};
