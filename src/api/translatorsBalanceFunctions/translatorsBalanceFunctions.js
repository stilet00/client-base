const moment = require('moment')

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

const getCurrentMonthPenalties = penalties => {
    if (!penalties) return '0'
    const currentDate = moment().utc()
    const onlyCurMonthPenalties = penalties.filter(({ dateTimeId }) =>
        moment(dateTimeId).utc().isSame(currentDate, 'month')
    )
    const totalPenaltiesForCurMonth = onlyCurMonthPenalties.reduce(
        (acc, currentPenalty) => {
            const amount = parseInt(currentPenalty.amount, 10) || 0
            return acc + amount
        },
        0
    )
    return totalPenaltiesForCurMonth.toString()
}

module.exports = {
    calculatePercentDifference,
    insertClientToTranslatorBalanceDays,
    getCurrentMonthPenalties,
    calculateBalanceDaySum,
}
