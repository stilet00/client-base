import moment from "moment";

export const DEFAULT_CLIENT = {
  name: "",
  surname: "",
  translators: [],
};

class DEFAULT_DAY_BALANCE {
  constructor(year, month, day) {
    this.id = moment(year+month+day, "YYYYMMDD").format("DD MM YYYY");
    this.chats = 0;
    this.letters = 0;
    this.datingChats = 0;
    this.datingLetters = 0;
    this.virtualGifts = 0;
    this.photoAttachments = 0;
    this.penalties = 0;
  }
}

export const DEFAULT_BALANCE_DATA =  [
    {
      year: moment().format("YYYY"),
      months: fillMonths(moment().format("YYYY"))
    }
  ]

export const DEFAULT_TRANSLATOR = {
  name: "",
  surname: "",
  clients: [],
};

function fillMonths (year) {
  let monthArray = [];
  for (let i = 1; i < 13; i++) {
    let month = fillDays(i, year);
    monthArray.push(month)
  }
  return monthArray;
}

function fillDays (month, year) {
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
};

