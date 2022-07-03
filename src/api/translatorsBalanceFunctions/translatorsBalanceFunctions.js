const moment = require('moment')

const calculateTranslatorYesterdayTotal = (
    statistics,
    onlySvadba = false,
    category = null
) => {
    const day = statistics
        .find(year => year.year === moment().subtract(1, 'day').format('YYYY'))
        .months.find(
            (month, index) =>
                index + 1 === Number(moment().subtract(1, 'day').format('M'))
        )
        .find(day => {
            return (
                day.id === moment().subtract(1, 'day').format('DD MM YYYY') ||
                day.id === moment().format('DD MM YYYY')
            )
        })
    return calculateBalanceDayAllClients(day, onlySvadba, category)
}

const calculateBalanceDayAllClients = (day, onlySvadba, category) => {
    return Number(
        day.clients
            .reduce((sum, current) => {
                return (
                    sum + calculateBalanceDaySum(current, onlySvadba, category)
                )
            }, 0)
            .toFixed(2)
    )
}

const calculateTranslatorMonthTotal = (
    statistics,
    forFullMonth = true,
    monthFilter = moment().format('MM'),
    yearFilter = moment().format('YYYY'),
    onlySvadba = false,
    category = null
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
                    return (
                        sum +
                        calculateBalanceDaySum(current, onlySvadba, category)
                    )
                }, 0)
            )
        }, 0)
    } else {
        total = month.reduce((sum, current, index) => {
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

    return Number(total.toFixed(2))
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

module.exports = {
    calculateTranslatorYesterdayTotal,
    calculateTranslatorMonthTotal,
}
