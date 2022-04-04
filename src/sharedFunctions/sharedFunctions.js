import moment from "moment";
import { currentDay, currentMonth, currentYear } from "../constants/constants";

export function calculateBalanceDaySum(targetObject) {
  const arrayToSum = Object.values(targetObject);
  const sumResult = arrayToSum.reduce((sum, current) => {
    return typeof current === "number" ? sum + current : sum;
  }, 0);
  return sumResult - targetObject.penalties * 2;
}

export function findYesterday() {
  return currentDay !== "1"
    ? moment(Number(currentDay) - 1, "D").format("D")
    : currentDay;
}

export function calculateBalanceDayAllClients(day) {
  return day.clients
    .reduce((sum, current) => {
      return sum + calculateBalanceDaySum(current);
    }, 0)
    .toFixed(2);
}

export function getTotalDaysOfMonth(year, monthNumber) {
  const stringMonth = monthNumber < 9 ? "0" + monthNumber : monthNumber;
  let totalDays = [];
  for (
      let i = 1;
      i <= moment(year + "-" + stringMonth, "YYYY-MM").daysInMonth();
      i++
  ) {
    totalDays.push(i);
  }
  return totalDays;
}

export const calculateTranslatorMonthTotal = (statistics, yearNumber = currentYear, monthNumber = Number(currentMonth)) => {
  const month = statistics
      .find((year) => year.year === yearNumber)
      .months.find(
          (month, index) => index + 1 === monthNumber
      );

  const total = month.reduce((sum, current) => {
    return (
        sum +
        current.clients.reduce((sum, current) => {
          return sum + calculateBalanceDaySum(current);
        }, 0)
    );
  }, 0);

  return total.toFixed(2);
};
