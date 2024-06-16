const mongoose = require("mongoose");

const { getCollections } = require("../database/collections");
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

const addNewClient = async function (request, response, next) {
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

// const deleteClient = (request, response) => {
//         collectionClients.deleteOne(
//             { _id: ObjectId(request.params.id) },
//             (err, docs) => {
//                 if (err) {
//                     return response.sendStatus(500)
//                 }
//                 response.sendStatus(200)
//             }
//         )
//     }

module.exports = { getAllClients, addNewClient, updateClient };
