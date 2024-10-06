const nodeMailer = require("nodemailer");
const {
	calculatePercentDifference,
	getCurrentMonthPenalties,
	calculateBalanceDaySum,
} = require("../../sharedFunctions/sharedFunctions");
const { getMomentUTC } = require("../utils/utils");
const getAdministratorsEmailTemplateHTMLCode = require("./email-templates/getAdministratorsEmailTemplateHTMLcode");
const getTranslatorsEmailTemplateHTMLCode = require("./email-templates/getTranslatorsEmailTemplate");
const { getCollections } = require("../database/collections");
const { DEFAULT_FINANCE_DAY } = require("../constants");
var path = require("path");

const calculatePercentAndProgressData = (
	currentMonthTotal,
	previousMonthTotal,
) => {
	const value = previousMonthTotal
		? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
		: 100;

	const progressIsPositive = currentMonthTotal >= previousMonthTotal;

	return {
		value: Math.abs(value.toFixed(2)),
		progressIsPositive,
	};
};

class imageAttachmentInformation {
	constructor(imageName) {
		this.filename = imageName;
		this.path = path.join(__dirname, "email-images", imageName);
		this.cid = imageName.replace(".png", "");
	}
}

const credentialsForNodeMailer = JSON.parse(
	process.env.CREDENTIALS_FOR_NODEMAILER,
);
const imageNamesArrayForEmail = [
	"email-icon.png",
	"customer.png",
	"chat.png",
	"love.png",
	"email-letter.png",
	"telephone.png",
	"gift.png",
	"heart.png",
	"dollar-sign.png",
	"voice.png",
	"penalties.png",
	"attachments.png",
];

const createTransport = () => {
	return nodeMailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: credentialsForNodeMailer.user,
			pass: credentialsForNodeMailer.pass,
		},
	});
};

const transporter = createTransport();

const sendEmailTemplateToAdministrators = async (translatorsCollection) => {
	let yesterdayTotalSum = 0;
	const arrayOfTranslatorsNamesAndMonthSums = translatorsCollection
		.map(({ name, surname, statistics }) => {
			const translatorStatisticsForYesterday = statistics.filter((balanceDay) =>
				getMomentUTC(balanceDay.dateTimeId)
					.clone()
					.subtract(1, "day")
					.isSame(getMomentUTC(), "day"),
			);
			const translatorSum = translatorStatisticsForYesterday.reduce(
				(sum, current) => {
					return sum + calculateBalanceDaySum(current.statistics);
				},
				0,
			);
			if (translatorSum) {
				yesterdayTotalSum += translatorSum;
			}
			return translatorSum
				? `${name} ${surname}: <b>${translatorSum.toFixed(2)} $</b>`
				: null;
		})
		.filter((notEmptyString) => notEmptyString);

	const emailHtmlTemplateForAdministrators =
		getAdministratorsEmailTemplateHTMLCode({
			arrayOfTranslatorsNamesAndMonthSums,
			yesterdayTotalSum,
		});

	const Admin = await getCollections().collectionAdmins.find().exec();
	const adminEmailList = Admin.map((admin) => admin.registeredEmail);

	const BusinessAdmin = await getCollections()
		.collectionBusinessAdmins.find()
		.exec();
	const businessAdminEmailList = BusinessAdmin.map((admin) => admin.email);

	const mailOptions = {
		from: '"Sunrise agency" <sunrise-agency@gmail.com>',
		to: [...adminEmailList, ...businessAdminEmailList],
		subject: `Date: ${getMomentUTC().clone().subtract(1, "day").format("MMMM DD, YYYY")}`,
		text: `Balance: ${yesterdayTotalSum?.toFixed(2)}$`,
		html: emailHtmlTemplateForAdministrators,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			throw new Error(error);
		}
		console.log(`Message sent to: ${info.accepted.join(", ")}`);
	});
};

const sendEmailTemplateToTranslators = async (translatorsCollection) => {
	let arrayOfTranslatorsInfoForEmailLetter = translatorsCollection.map(
		(translator) => ({
			email: translator.email,
			label: `${translator.name} ${translator.surname}`,
			id: translator._id,
			suspended: translator.suspended,
			activeClients: translator.clients,
			wantsToReceiveEmails: translator.wantsToReceiveEmails,
			personalPenalties: translator.personalPenalties,
			statistics: translator.statistics,
		}),
	);

	const previousMonth = getMomentUTC().clone().subtract(1, "month");
	const currentMonth = getMomentUTC().clone();

	arrayOfTranslatorsInfoForEmailLetter =
		arrayOfTranslatorsInfoForEmailLetter.map((translator) => {
			const translatorsStatistics = translator.statistics;

			const balanceDaysForYesterday = translatorsStatistics.filter(
				(balanceDay) => {
					return getMomentUTC(balanceDay.dateTimeId)
						.clone()
						.isSame(currentMonth.clone().subtract(1, "day"), "day");
				},
			);

			const balanceDaysForCurrentMonth = translatorsStatistics.filter(
				(balanceDay) =>
					getMomentUTC(balanceDay.dateTimeId)
						.clone()
						.isSame(currentMonth, "month"),
			);

			const balanceDaysForPreviousMonth = translatorsStatistics.filter(
				(balanceDay) =>
					getMomentUTC(balanceDay.dateTimeId)
						.clone()
						.isSame(previousMonth, "month"),
			);

			const yesterdayTotal = balanceDaysForYesterday.reduce((sum, current) => {
				return sum + calculateBalanceDaySum(current.statistics);
			}, 0);

			const currentMonthTotal = balanceDaysForCurrentMonth.reduce(
				(sum, current) => {
					return sum + calculateBalanceDaySum(current.statistics);
				},
				0,
			);

			const previousMonthTotal = balanceDaysForPreviousMonth.reduce(
				(sum, current) => {
					return sum + calculateBalanceDaySum(current.statistics);
				},
				0,
			);

			const percentAndProgressData = calculatePercentAndProgressData(
				currentMonthTotal,
				previousMonthTotal,
			);
			const financeFieldList = new DEFAULT_FINANCE_DAY();
			const detailedStatistic = balanceDaysForYesterday.map((balanceDay) => {
				const clientOnBalanceDay = balanceDay.client;
				const clientFullName = `${clientOnBalanceDay.name} ${clientOnBalanceDay.surname}`;
				const statisticByClient = Object.keys(financeFieldList).map(
					(categoryName) => {
						return {
							[categoryName]: calculateBalanceDaySum(
								balanceDay.statistics,
								false,
								categoryName,
							),
						};
					},
				);
				return {
					name: clientFullName,
					statistics: statisticByClient,
				};
			});

			const curMonthPenalties = getCurrentMonthPenalties(
				translator.personalPenalties,
			);
			return {
				...translator,
				yesterdayTotal,
				currentMonthTotal,
				percentAndProgressData,
				detailedStatistic,
				curMonthPenalties,
			};
		});

	const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	const arrayOfTranslatorsWhoReceivedLetter = [];

	for (const [
		index,
		translatorInfoForEmailLetter,
	] of arrayOfTranslatorsInfoForEmailLetter.entries()) {
		const emailHtmlTemplateForTranslators = getTranslatorsEmailTemplateHTMLCode(
			translatorInfoForEmailLetter,
		);
		const imagesPathArrayForEmail = imageNamesArrayForEmail.map(
			(imageName) => new imageAttachmentInformation(imageName),
		);

		const mailOptions = {
			from: '"Sunrise agency" <sunrise-agency@gmail.com>',
			to: translatorInfoForEmailLetter.email,
			subject: `Date: ${getMomentUTC().clone().subtract(1, "day").format("MMMM DD, YYYY")}`,
			text: `Balance: ${translatorInfoForEmailLetter.yesterdayTotal}$`,
			html: emailHtmlTemplateForTranslators,
			attachments: imagesPathArrayForEmail,
		};

		await delay(index * 5000);
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				throw new Error(error);
			}
			console.log(`Message sent to: ${info.accepted.join(", ")}`);
		});

		arrayOfTranslatorsWhoReceivedLetter.push(
			translatorInfoForEmailLetter.label,
		);
	}

	return arrayOfTranslatorsWhoReceivedLetter;
};

module.exports = {
	sendEmailTemplateToAdministrators,
	sendEmailTemplateToTranslators,
};
