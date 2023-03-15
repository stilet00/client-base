import moment from 'moment'
import {
    currentMonth,
    currentYear,
    localStorageTokenKey,
} from '../constants/constants'

export function calculateBalanceDaySum(
    targetObject,
    onlySvadba = false,
    category = null
) {
    if (onlySvadba) {
        const svadbaObject = {
            ...targetObject,
            dating: 0,
            virtualGiftsDating: 0,
        }

        const svadbaSum = Object.values(svadbaObject).reduce((sum, current) => {
            return typeof current === 'number' ? sum + current : sum
        }, 0)

        return svadbaSum - svadbaObject.penalties * 2
    } else if (category) {
        const categorizedObject = {
            [category]: targetObject[category],
        }
        const categorySum = Object.values(categorizedObject).reduce(
            (sum, current) => {
                return typeof current === 'number' ? sum + current : sum
            },
            0
        )

        return categorySum
    } else {
        const arrayToSum = Object.values(targetObject)

        const sumResult = arrayToSum.reduce((sum, current) => {
            return typeof current === 'number' ? sum + current : sum
        }, 0)

        return sumResult - targetObject.penalties * 2
    }
}

export function calculateBalanceDayAllClients(day, category = null) {
    return day?.clients
        .reduce((sum, balanceDay) => {
            return sum + calculateBalanceDaySum(balanceDay, false, category)
        }, 0)
        .toFixed(2)
}

export function getTotalDaysOfMonth(year, monthNumber) {
    const stringMonth = monthNumber < 9 ? '0' + monthNumber : monthNumber
    let totalDays = []
    for (
        let i = 1;
        i <= moment(year + '-' + stringMonth, 'YYYY-MM').daysInMonth();
        i++
    ) {
        totalDays.push(i)
    }
    return totalDays
}

export const calculateTranslatorMonthTotal = (
    statistics,
    forFullMonth = true,
    monthFilter = currentMonth,
    yearFilter = currentYear,
    onlySvadba = false,
    category = null
) => {
    const month = statistics
        .find(year => year.year === yearFilter)
        ?.months.find((month, index) => index + 1 === Number(monthFilter))

    let total

    if (forFullMonth) {
        total = month?.reduce((sum, current) => {
            return (
                sum +
                current.clients.reduce((sum, current) => {
                    return (
                        sum +
                        calculateBalanceDaySum(current, onlySvadba, category)
                    )
                }, 0)
            )
        }, 0)
    } else {
        total = month?.reduce((sum, current, index) => {
            return index + 1 < Number(moment().format('D'))
                ? sum +
                      current.clients.reduce((sum, current) => {
                          return (
                              sum +
                              calculateBalanceDaySum(
                                  current,
                                  onlySvadba,
                                  category
                              )
                          )
                      }, 0)
                : sum
        }, 0)
    }

    return getNumberWithHundreds(total)
}

export function getStringMonthNumber(monthNumber) {
    return monthNumber < 10 ? '0' + monthNumber : String(monthNumber)
}

export function getSumFromArray(arrayOfNumbers) {
    return arrayOfNumbers.reduce((sum, current) => sum + current, 0)
}

export function getMiddleValueFromArray(arrayOfNumbers) {
    const sum = getSumFromArray(arrayOfNumbers)
    if (arrayOfNumbers.length === 0) {
        return 0
    }
    return Math.round(sum / arrayOfNumbers.length)
}
export function getClientsRating(MiddleMonthSum = 0) {
    return MiddleMonthSum >= 80
        ? 5
        : MiddleMonthSum >= 60
        ? 4
        : MiddleMonthSum >= 40
        ? 3
        : MiddleMonthSum >= 20
        ? 2
        : MiddleMonthSum >= 10
        ? 1
        : 0
}

export function calculatePercentDifference(currentSum, previousSum) {
    const difference =
        currentSum > previousSum
            ? ((currentSum - previousSum) * 100) / currentSum
            : ((previousSum - currentSum) * 100) / previousSum
    const result = difference.toString() === 'NaN' ? 0 : difference.toFixed(1)
    if (result[result.length - 1] === '0') {
        return result.slice(0, result.length - 2)
    }
    return Math.round(result)
}

export function getNumberWithHundreds(number) {
    return Number(number?.toFixed(2))
}

export function saveUserIdTokenToLocalStorage(idToken) {
    window.localStorage.setItem(localStorageTokenKey, idToken)
}