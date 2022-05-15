import moment from 'moment'
import { currentMonth, currentYear } from '../constants/constants'

export function calculateBalanceDaySum(targetObject, onlySvadba = false) {
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
    } else {
        const arrayToSum = Object.values(targetObject)

        const sumResult = arrayToSum.reduce((sum, current) => {
            return typeof current === 'number' ? sum + current : sum
        }, 0)

        return sumResult - targetObject.penalties * 2
    }
}

export function calculateBalanceDayAllClients(day) {
    return day.clients
        .reduce((sum, current) => {
            return sum + calculateBalanceDaySum(current)
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
    onlySvadba = false
) => {
    const month = statistics
        .find(year => year.year === yearFilter)
        .months.find((month, index) => index + 1 === Number(monthFilter))

    let total

    if (forFullMonth) {
        total = month.reduce((sum, current) => {
            return (
                sum +
                current.clients.reduce((sum, current) => {
                    return sum + calculateBalanceDaySum(current, onlySvadba)
                }, 0)
            )
        }, 0)
    } else {
        total = month.reduce((sum, current, index) => {
            return index + 1 < Number(moment().format('D'))
                ? sum +
                      current.clients.reduce((sum, current) => {
                          return (
                              sum + calculateBalanceDaySum(current, onlySvadba)
                          )
                      }, 0)
                : sum
        }, 0)
    }

    return Number(total.toFixed(2))
}

export function getStringMonthNumber(monthNumber) {
    return monthNumber < 10 ? '0' + monthNumber : String(monthNumber)
}

export function getSumFromArray(arrayOfNumbers) {
    return arrayOfNumbers.reduce((sum, current) => sum + current, 0)
}

export function getMiddleValueFromArray(arrayOfNumbers) {
    const sum = getSumFromArray(arrayOfNumbers)

    return Math.round(sum / arrayOfNumbers.length)
}

export function calculatePercentDifference(currentSum, previousSum) {
    const difference =
        currentSum > previousSum
            ? ((currentSum - previousSum) * 100) / currentSum
            : ((previousSum - currentSum) * 100) / previousSum

    return difference.toString() === 'NaN' ? 0 : Math.round(difference)
}
