import moment from "moment";

export function calculateBalanceDaySum(targetObject) {
    const arrayToSum = Object.values(targetObject);
    const sumResult = arrayToSum.reduce((sum, current) => {
        return typeof current === "number" ? sum + current : sum;
    }, 0);
    return sumResult - targetObject.penalties * 2;
}

export function findYesterday() {
    return moment().format("D") !== "1" ? moment(Number(moment().format("D")) - 1, "D").format('D') : moment().format("D")
}