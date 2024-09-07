import {
	getStringMonthNumber,
	getTotalDaysOfMonth,
} from "../sharedFunctions/sharedFunctions";
import moment from "moment";

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

function creatArrayOfYears() {
	const arrayWithYears = [];
	const lengthOfArrayWithYears = Number(currentYear) - appStartYear;
	for (let i = 0; i < lengthOfArrayWithYears + 1; i++) {
		arrayWithYears.unshift(String(appStartYear + i));
	}
	return arrayWithYears;
}

export const FINANCE_SENDERS = {
	anton: "Anton",
	agency: "Agency",
	oleksandr: "Oleksandr",
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

export const TRANSLATORS_SALARY_PERCENT = 0.45;
export const PAYONEER_COMISSION = 0.968;
