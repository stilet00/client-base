export function calculateBalanceDaySum(targetObject) {
    const arrayToSum = Object.values(targetObject);
    const sumResult = arrayToSum.reduce((sum, current) => {
        return typeof current === "number" ? sum + current : sum;
    }, 0);
    return sumResult - targetObject.penalties * 2;
}