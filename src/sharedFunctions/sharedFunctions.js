import moment from "moment";
import { currentDay } from "../constants/constants";

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
