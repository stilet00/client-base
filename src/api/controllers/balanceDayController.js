const moment = require("moment");
const { getMomentUTC } = require("../utils/utils");
const { getCollections } = require("../database/collections");
const {
	calculateBalanceDaySum,
} = require("../translatorsBalanceFunctions/translatorsBalanceFunctions");
const ObjectId = require("mongodb").ObjectId;

const getBalanceDay = async (req, res) => {
	try {
		const { dateTimeId, translatorId, clientId } = req.query;
		const decodedDateTimeIdString = decodeURIComponent(dateTimeId);
		const BalanceDay = await getCollections().collectionBalanceDays;
		const balanceDay = await BalanceDay.findOne({
			translator: new ObjectId(translatorId),
			client: new ObjectId(clientId),
			dateTimeId: moment.utc(decodedDateTimeIdString).startOf("day").format(),
		});
		res.send(balanceDay);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

const createBalanceDay = async (req, res) => {
	try {
		const { translator, client, dateTimeId, statistics } = req.body;
		const translatorId = new ObjectId(translator._id);
		const clientId = new ObjectId(client._id);

		const BalanceDay = await getCollections().collectionBalanceDays;
		const Translator = await getCollections().collectionTranslators;
		const formattedDateTimeId = getMomentUTC(dateTimeId)
			.startOf("day")
			.format();

		const newBalanceDay = new BalanceDay({
			translator: translatorId,
			client: clientId,
			dateTimeId: formattedDateTimeId,
			statistics,
		});
		await newBalanceDay.save();
		await Translator.updateOne(
			{ _id: translatorId },
			{ $push: { statistics: newBalanceDay._id } },
		);
		res.send(newBalanceDay);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const updateBalanceDay = async (req, res) => {
	try {
		const { _id: id, statistics } = req.body;
		const BalanceDay = await getCollections().collectionBalanceDays;
		const updatedBalanceDay = await BalanceDay.findByIdAndUpdate(
			id,
			{
				statistics,
			},
			{ new: true },
		);

		res.send(updatedBalanceDay);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getBalanceDaysForTranslators = async (req, res) => {
	try {
		const { translatorId, dateTimeFilter } = req.query;
		const BalanceDay = await getCollections().collectionBalanceDays;
		const query = {};
		if (translatorId) {
			query.translator = translatorId;
		}
		if (dateTimeFilter) {
			const endOfMonthInFilter = moment
				.utc(dateTimeFilter)
				.endOf("month")
				.toISOString();
			const startOfPreviousMonthInFilter = moment
				.utc(dateTimeFilter)
				.subtract(1, "months")
				.startOf("month")
				.toISOString();
			query.dateTimeId = {
				$gte: startOfPreviousMonthInFilter,
				$lte: endOfMonthInFilter,
			};
		}
		const balanceDays = await BalanceDay.find(query).exec();
		res.send(balanceDays);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllBalanceDays = async (req, res) => {
	try {
		const { yearFilter, monthFilter } = req.query;
		const BalanceDay = await getCollections().collectionBalanceDays;
		const query = {};

		if (yearFilter) {
			const momentFromYearFilter = moment.utc(yearFilter, "YYYY");
			const startOfYearFilter = momentFromYearFilter
				.startOf("year")
				.toISOString();
			const endOfYearFilter = momentFromYearFilter.endOf("year").toISOString();
			query.dateTimeId = {
				$gte: startOfYearFilter,
				$lte: endOfYearFilter,
			};
		}

		if (monthFilter) {
			const [startMonth, endMonth] = monthFilter.split("-").map(Number);
			const year = yearFilter
				? moment.utc(yearFilter, "YYYY").year()
				: moment.utc().year();
			const startOfMonthFilter = moment
				.utc({ year, month: startMonth - 1 })
				.startOf("month")
				.toISOString();
			const endOfMonthFilter = moment
				.utc({ year, month: (endMonth || startMonth) - 1 })
				.endOf("month")
				.toISOString();

			if (!query.dateTimeId) {
				query.dateTimeId = {};
			}
			query.dateTimeId.$gte = startOfMonthFilter;
			query.dateTimeId.$lte = endOfMonthFilter;
		}
		const balanceDays = await BalanceDay.find(query).exec();
		res.send(balanceDays);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getBalanceDayForSelectedDate = async (req, res) => {
	const selectedDateStr = req?.query["selected-date"];
	if (selectedDateStr) {
		try {
			const BalanceDay = await getCollections().collectionBalanceDays;
			const selectedBalanceDays = await BalanceDay.find({
				dateTimeId: new Date(selectedDateStr),
			});
			if (selectedBalanceDays.length > 0) {
				res.send(selectedBalanceDays);
			} else {
				res.status(404).json({
					error: "BalanceDay not found for the selected date",
				});
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: "Internal server error" });
		}
	} else {
		res.status(400).json({ error: "Selected date is missing" });
	}
};

const getCurrentMonthTotal = async (req, res) => {
	try {
		const BalanceDay = await getCollections().collectionBalanceDays;
		const startOfMonth = getMomentUTC().startOf("month").format();
		const endOfCurrentDay = getMomentUTC().endOf("day").format();
		const balanceDays = await BalanceDay.find({
			dateTimeId: {
				$gte: startOfMonth,
				$lte: endOfCurrentDay,
			},
		}).exec();
		if (balanceDays.length === 0) {
			res.send("0");
			return;
		}
		const currentMonthSumTillNow = balanceDays.reduce((sum, current) => {
			return sum + calculateBalanceDaySum(current.statistics);
		}, 0);
		res.send(`${currentMonthSumTillNow?.toFixed(2)}`);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	getBalanceDay,
	createBalanceDay,
	updateBalanceDay,
	getBalanceDaysForTranslators,
	getAllBalanceDays,
	getCurrentMonthTotal,
	getBalanceDayForSelectedDate,
};
