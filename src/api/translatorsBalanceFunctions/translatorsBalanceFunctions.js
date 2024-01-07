const moment = require('moment')

class DEFAULT_DAY_BALANCE {
    constructor(year, month, day) {
        this.id = moment(year + month + day, 'YYYYMMDD').format('DD MM YYYY')
        this.clients = []
    }
}

class DEFAULT_DAY_CLIENT {
    constructor(clientId) {
        this.id = clientId
        this.chats = 0
        this.letters = 0
        this.dating = 0
        this.virtualGiftsSvadba = 0
        this.virtualGiftsDating = 0
        this.photoAttachments = 0
        this.phoneCalls = 0
        this.penalties = 0
        this.voiceMessages = 0
        this.comments = ''
    }
}

const calculateBalanceDaySum = (
    targetObject,
    onlySvadba = false,
    category = null
) => {
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

const calculatePercentDifference = (currentSum, previousSum) => {
    const difference =
        currentSum > previousSum
            ? ((currentSum - previousSum) * 100) / currentSum
            : ((previousSum - currentSum) * 100) / previousSum
    const result = difference.toString() === 'NaN' ? 0 : difference.toFixed(1)
    if (result[result.length - 1] === '0') {
        return {
            progressIsPositive: currentSum > previousSum,
            value: result.slice(0, result.length - 2),
        }
    }
    return {
        progressIsPositive: currentSum > previousSum,
        value: Math.round(result),
    }
}

const fillDaysForStatistics = (month, year) => {
    const stringMonth = month < 10 ? '0' + month : month
    let totalDays = []
    for (
        let i = 1;
        i <= moment(year + '-' + stringMonth, 'YYYY-MM').daysInMonth();
        i++
    ) {
        let data = new DEFAULT_DAY_BALANCE(year, stringMonth, i)
        totalDays.push(data)
    }
    return totalDays
}

const fillMonthsForStatistics = year => {
    let monthArray = []
    for (let i = 1; i < 13; i++) {
        let month = fillDaysForStatistics(i, year)
        monthArray.push(month)
    }
    return monthArray
}

const createYearStatisticsForTranslator = () => {
    const currentYear = moment().format('YYYY')
    const yearStatisticsObject = {
        year: currentYear,
        months: fillMonthsForStatistics(currentYear),
    }

    return yearStatisticsObject
}

const insertClientToTranslatorBalanceDays = (balanceYearToUpdate, clientId) => {
    const clientBalanceDay = new DEFAULT_DAY_CLIENT(clientId)

    balanceYearToUpdate.months.forEach((month, monthIndex) =>
        month.forEach((day, dayIndex) => {
            balanceYearToUpdate.months[monthIndex][dayIndex].clients.push(
                clientBalanceDay
            )
        })
    )
}

const calCurMonthTranslatorPenaties = penalties => {
    if (!penalties) return '0'
    const currentDate = moment()
    const onlyCurMonthPenalties = penalties.filter(penalty => {
        const penaltyDate = moment(penalty.date, 'DD MM YYYY')
        return penaltyDate.isSame(currentDate, 'month')
    })
    const totalPenaltiesForCurMonth = onlyCurMonthPenalties.reduce(
        (acc, currerentPenalty) => {
            const amount = parseInt(currerentPenalty.amount, 10) || 0
            return acc + amount
        },
        0
    )
    return totalPenaltiesForCurMonth.toString()
}

module.exports = {
    calculatePercentDifference,
    createYearStatisticsForTranslator,
    insertClientToTranslatorBalanceDays,
    calCurMonthTranslatorPenaties,
    calculateBalanceDaySum,
}
