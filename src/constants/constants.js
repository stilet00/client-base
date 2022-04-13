import moment from "moment";

export const DEFAULT_CLIENT = {
  name: "",
  surname: "",
  translators: [],
  suspended: false,
};

class DEFAULT_DAY_BALANCE {
  constructor(year, month, day) {
    this.id = moment(year + month + day, "YYYYMMDD").format("DD MM YYYY");
    this.clients = [];
  }
}

export class DEFAULT_DAY_CLIENT {
  constructor(clientId) {
    this.id = clientId;
    this.chats = 0;
    this.letters = 0;
    this.dating = 0;
    this.virtualGiftsSvadba = 0;
    this.virtualGiftsDating = 0;
    this.photoAttachments = 0;
    this.phoneCalls = 0;
    this.penalties = 0;
    this.comments = "";
  }
}

export const DEFAULT_BALANCE_DATA = [
  {
    year: moment().format("YYYY"),
    months: fillMonths(moment().format("YYYY")),
  },
];

export const DEFAULT_TRANSLATOR = {
  name: "",
  surname: "",
  clients: [],
  statistics: DEFAULT_BALANCE_DATA,
  suspended: {
    status: false,
    time: null,
  },
};

function fillMonths(year) {
  let monthArray = [];
  for (let i = 1; i < 13; i++) {
    let month = fillDays(i, year);
    monthArray.push(month);
  }
  return monthArray;
}

function fillDays(month, year) {
  const stringMonth = month < 10 ? "0" + month : month;
  let totalDays = [];
  for (
    let i = 1;
    i <= moment(year + "-" + stringMonth, "YYYY-MM").daysInMonth();
    i++
  ) {
    let data = new DEFAULT_DAY_BALANCE(year, stringMonth, i);
    totalDays.push(data);
  }
  return totalDays;
}

export const currentYear = moment().format("YYYY");
export const currentMonth = moment().format("M");
export const currentDay = moment().format("D");
