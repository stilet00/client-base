import {
	getStringMonthNumber,
	getTotalDaysOfMonth,
} from "../sharedFunctions/sharedFunctions";
import moment from "moment";
import background1 from "../images/tasks_backgrounds/background1.png";
import background2 from "../images/tasks_backgrounds/background2.png";
import background3 from "../images/tasks_backgrounds/background3.png";
import background4 from "../images/tasks_backgrounds/background4.png";
import background5 from "../images/tasks_backgrounds/background5.png";
import background6 from "../images/tasks_backgrounds/background6.png";
import background7 from "../images/tasks_backgrounds/background7.png";
import background8 from "../images/tasks_backgrounds/background8.png";
import background9 from "../images/tasks_backgrounds/background9.png";
import background10 from "../images/tasks_backgrounds/background10.png";
import Agency_avatar from "../images/logo.png";
import Anton_avatar from "../images/avatars/anton-avatar.png";
import Oleksandr_avatar from "../images/avatars/sasha-avatar.png";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import { purple, blue, green, cyan } from "@mui/material/colors";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PermPhoneMsgIcon from "@mui/icons-material/PermPhoneMsg";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

export const currentYear = moment().utc().format("YYYY");
export const previousYear = moment().utc().subtract(1, "year").format("YYYY");
export const currentMonth = moment().utc().format("M");
export const previousMonth = moment().utc().subtract(1, "month").format("M");
export const previousDay = moment().utc().subtract(1, "day").format("D");
export const appStartYear = 2022;
export const arrayOfYearsForSelectFilter = creatArrayOfYears();
export const inactivityPeriod = 1000 * 60 * 20;

export const localStorageTokenKey = "clientBaseUserToken";

export const DEFAULT_CLIENT = {
	name: "",
	surname: "",
	bankAccount: "",
	instagramLink: "",
	suspended: false,
	svadba: {
		login: "",
		password: "",
	},
	dating: {
		login: "",
		password: "",
	},
	image: "",
};

export class DEFAULT_PENALTY {
	dateTimeId: string;
	amount: number;
	description: string;
	translator: string;

	constructor(translatorId: string, dateTimeId: string) {
		this.dateTimeId = dateTimeId;
		this.amount = 0;
		this.description = "";
		this.translator = translatorId;
	}
}

export class DEFAULT_MONTH_CHART {
	year: string;
	month: string;
	days: number[];
	values: number[];

	constructor(year: string, month: number) {
		this.year = year;
		this.month = getStringMonthNumber(month);
		this.days = getTotalDaysOfMonth(year, month);
		this.values = [];
	}
}

type Statistics = {
	chats: number;
	letters: number;
	dating: number;
	virtualGiftsSvadba: number;
	virtualGiftsDating: number;
	photoAttachments: number;
	phoneCalls: number;
	voiceMessages: number;
	penalties: number;
	comments: string;
};

type Entity = {
	_id: string;
};

export class EMPTY_BALANCE_DAY {
	dateTimeId: string;
	client: Entity;
	translator: Entity;
	statistics: Statistics;

	constructor(translatorId: string, clientId: string, dateTimeId: string) {
		this.dateTimeId = dateTimeId;
		this.client = { _id: clientId };
		this.translator = { _id: translatorId };
		this.statistics = {
			chats: 0,
			letters: 0,
			dating: 0,
			virtualGiftsSvadba: 0,
			virtualGiftsDating: 0,
			photoAttachments: 0,
			phoneCalls: 0,
			voiceMessages: 0,
			penalties: 0,
			comments: "",
		};
	}
}

export const DEFAULT_ERROR = {
	status: false,
	text: null,
};

export const DEFAULT_TRANSLATOR = {
	name: "",
	surname: "",
	suspended: {
		status: false,
		time: null,
	},
	email: null,
};

export const SUNRISE_AGENCY_ID = "62470d5dffe20600169edac1";

export const DEFAULT_CATEGORIES = {
	chats: "chats",
	dating: "dating",
	letters: "letters",
	penalties: "penalties",
	virtualGiftsSvadba: "virtualGiftsSvadba",
	virtualGiftsDating: "virtualGiftsDating",
	photoAttachments: "photoAttachments",
	phoneCalls: "phoneCalls",
	voiceMessages: "voiceMessages",
};

function creatArrayOfYears() {
	const arrayWithYears = [];
	const lengthOfArrayWithYears = Number(currentYear) - appStartYear;
	for (let i = 0; i < lengthOfArrayWithYears + 1; i++) {
		arrayWithYears.unshift(String(appStartYear + i));
	}
	return arrayWithYears;
}

export const TASKS_BACKGROUNDS = [
	background1,
	background2,
	background3,
	background4,
	background5,
	background6,
	background7,
	background8,
	background9,
	background10,
];

export const FINANCE_SENDERS = {
	anton: "Anton",
	agency: "Agency",
	oleksandr: "Oleksandr",
};

export const FINANCE_AVATARS = {
	anton: Anton_avatar,
	oleksandr: Oleksandr_avatar,
	agency: Agency_avatar,
};

export const FINANCE_IMAGES = {
	salary: () => <MonetizationOnIcon sx={{ fontSize: 40, color: green[400] }} />,
	paymentToScout: () => (
		<CreditScoreIcon sx={{ fontSize: 40, color: blue[500] }} />
	),
	paymentToBot: () => <AdUnitsIcon sx={{ fontSize: 40, color: purple[500] }} />,
	paymentToTranslator: () => (
		<FaceRetouchingNaturalIcon sx={{ fontSize: 40, color: cyan[500] }} />
	),
};

export const FINANCE_COMMENTS = {
	salary: "salary",
	paymentToScout: "Payment to scout",
	paymentToBot: "Payment to bot",
	paymentToTranslator: "Payment to translator",
};

export const DEFAULT_STATEMENT = {
	receiver: "",
	amount: 0,
	sender: FINANCE_SENDERS.agency,
	comment: FINANCE_COMMENTS.salary,
	date: moment().utc(),
};

export const BOT_LIST = [
	{ id: "Chat4me7210Sunrise", label: "Chat4me" },
	{ id: "Sender7210Sunrise", label: "Sender" },
];

type ChartCategory = {
	name: string;
	value: string | null;
	icon?: JSX.Element;
};

export const CHARTS_CATEGORIES: ChartCategory[] = [
	{
		name: "All",
		value: null,
		icon: <SignalCellularAltIcon />,
	},
	{
		name: "Chats",
		value: "chats",
		icon: <ChatIcon />,
	},
	{
		name: "Letters",
		value: "letters",
		icon: <EmailIcon />,
	},
	{
		name: "Dating",
		value: "dating",
		icon: <FavoriteIcon sx={{ color: "red" }} />,
	},
	{
		name: "Phone Calls",
		value: "phoneCalls",
		icon: <PermPhoneMsgIcon />,
	},
	{
		name: "Virtual Gifts Svadba",
		value: "virtualGiftsSvadba",
		icon: <CardGiftcardIcon />,
	},
	{
		name: "Voice Messages",
		value: "voiceMessages",
		icon: <KeyboardVoiceIcon sx={{ color: "red" }} />,
	},
	{
		name: "Attachments",
		value: "photoAttachments",
	},
	{
		name: "Voice Messages",
		value: "voiceMessages",
	},
	{
		name: "Penalties",
		value: "penalties",
	},
];

export const TRANSLATORS_SALARY_PERCENT = 0.45;
export const PAYONEER_COMISSION = 0.968;
