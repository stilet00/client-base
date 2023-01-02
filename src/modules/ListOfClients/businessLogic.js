import { useCallback, useState } from 'react'
import { DEFAULT_CLIENT } from '../../constants/constants'
import useModal from '../../sharedHooks/useModal'
import {
    calculateBalanceDaySum,
    getMiddleValueFromArray,
    getSumFromArray,
    getNumberWithHundreds,
} from '../../sharedFunctions/sharedFunctions'
import moment from 'moment'

export const useClientsForm = ({ onFormSubmit, editedClient }) => {
    const [client, setClient] = useState(editedClient || DEFAULT_CLIENT)

    const { handleClose, handleOpen, open } = useModal()

    const handleChange = useCallback(
        e => {
            setClient({ ...client, [e.target.name]: e.target.value.trim() })
        },
        [client]
    )

    function clearClient() {
        setClient(DEFAULT_CLIENT)
    }

    return {
        handleOpen,
        open,
        client,
        clearClient,
        handleClose,
        onFormSubmit,
        handleChange,
    }
}

export const useClientsList = translators => {
    const getTotalProfitPerClient = (clientId, date = moment()) => {
        let totalProfitForAllYears = 0
        let profitForCurrentYear = 0

        function getProfits(translator) {
            translator.statistics.forEach(year => {
                year.months.forEach(month => {
                    month.forEach(day => {
                        const clientBalanceDay = day.clients.find(
                            client => client.id === clientId
                        )
                        if (clientBalanceDay) {
                            totalProfitForAllYears =
                                totalProfitForAllYears +
                                calculateBalanceDaySum(clientBalanceDay)
                        }
                    })
                })
            })
            const thisYearStat = translator.statistics.find(
                year => year.year === date.format('YYYY')
            )
            thisYearStat?.months.forEach(month => {
                month.forEach(day => {
                    const clientBalanceDay = day.clients.find(
                        client => client.id === clientId
                    )
                    if (clientBalanceDay) {
                        profitForCurrentYear =
                            profitForCurrentYear +
                            calculateBalanceDaySum(clientBalanceDay)
                    }
                })
            })
        }
        translators.forEach(getProfits)
        const clientsProfit = {
            currentYearProfit: getNumberWithHundreds(profitForCurrentYear),
            allYearsProfit: getNumberWithHundreds(totalProfitForAllYears),
        }
        return clientsProfit
    }

    function clientMonthSum(clientId, date = moment()) {
        let totalClientBalance = 0

        translators.forEach(translator => {
            const thisYearStat = translator.statistics.find(
                year => year.year === date.format('YYYY')
            )
            const thisMonthStat = thisYearStat?.months[date.format('M') - 1]

            thisMonthStat?.forEach(day => {
                const clientBalanceDay = day.clients.find(
                    client => client.id === clientId
                )
                if (clientBalanceDay) {
                    totalClientBalance =
                        totalClientBalance +
                        calculateBalanceDaySum(clientBalanceDay)
                }
            })
        })
        return getNumberWithHundreds(totalClientBalance)
    }

    function getAllAsignedTranslators(clientId, date = moment()) {
        let arrayOfTranslators = []

        translators.forEach(({ name, surname, clients, suspended }) => {
            const assignedClient = clients.find(
                client => client._id === clientId
            )
            if (assignedClient && 'suspended' in assignedClient) {
                if (!assignedClient.suspended && !suspended.status) {
                    arrayOfTranslators.push(`${name} ${surname}`)
                }
            } else if (assignedClient && !('suspended' in assignedClient)) {
                if (!suspended.status) {
                    arrayOfTranslators.push(`${name} ${surname}`)
                }
            }
        })
        return arrayOfTranslators
    }

    function calculateMiddleMonthSum(clientId, date = moment()) {
        let monthSumArray = []

        let totalClientBalance = 0

        translators.forEach(translator => {
            const thisYearStat = translator.statistics.find(
                year => year.year === date.format('YYYY')
            )

            const thisMonthStat = thisYearStat?.months[date.format('M') - 1]

            thisMonthStat?.forEach((day, index) => {
                if (index === 0 || index < moment().format('D')) {
                    const clientBalanceDay = day.clients.find(
                        client => client.id === clientId
                    )

                    if (clientBalanceDay) {
                        if (typeof monthSumArray[index] === 'undefined') {
                            const dayArray = []
                            monthSumArray[index] = [
                                ...dayArray,
                                getNumberWithHundreds(
                                    calculateBalanceDaySum(clientBalanceDay)
                                ),
                            ]
                        } else {
                            monthSumArray[index] = [
                                ...monthSumArray[index],
                                getNumberWithHundreds(
                                    calculateBalanceDaySum(clientBalanceDay)
                                ),
                            ]
                        }
                        totalClientBalance =
                            totalClientBalance +
                            calculateBalanceDaySum(clientBalanceDay)
                    }
                }
            })
        })

        monthSumArray = monthSumArray.map(day => getSumFromArray(day))
        return Math.round(getMiddleValueFromArray(monthSumArray))
    }

    function sortBySum(clientOne, clientTwo) {
        return clientMonthSum(clientOne._id) < clientMonthSum(clientTwo._id)
            ? 1
            : -1
    }

    function getClientsRating(clientId) {
        const rating = calculateMiddleMonthSum(clientId)

        return rating > 100
            ? 5
            : rating > 50
            ? 4
            : rating > 30
            ? 3
            : rating > 20
            ? 2
            : rating > 10
            ? 1
            : 0
    }
    function getArrayOfBalancePerDay(
        clientId,
        category = null,
        date = moment()
    ) {
        let currentMonthSum = []
        let previousMonthSum = []
        let monthsSum = {
            currentMonth: [],
            previousMonth: [],
        }

        translators.forEach(translator => {
            const thisYearStat = translator.statistics.find(
                year => year.year === date.format('YYYY')
            )

            const thisMonthStat = thisYearStat?.months[date.format('M') - 1]
            const findPreviousMonthStat = date => {
                if (date.format('M') === '1') {
                    const previousYearStat = translator.statistics.find(
                        year =>
                            year.year ===
                            moment().subtract(1, 'year').format('YYYY')
                    )
                    const previousMonth =
                        previousYearStat.months[
                            moment().subtract(2, 'month').format('M')
                        ]

                    return previousMonth
                } else {
                    const previousMonth =
                        thisYearStat?.months[date.format('M') - 2]
                    return previousMonth
                }
            }
            const previousMonthStat = findPreviousMonthStat(date)
            getArrayWithAmountsPerDayForPickedMonth(
                clientId,
                thisMonthStat,
                currentMonthSum,
                category
            )
            getArrayWithAmountsPerDayForPickedMonth(
                clientId,
                previousMonthStat,
                previousMonthSum,
                category,
                31
            )
        })
        currentMonthSum = currentMonthSum.map(day =>
            Math.round(getSumFromArray(day))
        )
        previousMonthSum = previousMonthSum.map(day =>
            Math.round(getSumFromArray(day))
        )

        return (monthsSum = {
            ...monthsSum,
            currentMonth: currentMonthSum,
            previousMonth: previousMonthSum,
        })
    }

    const getArrayWithAmountsPerDayForPickedMonth = (
        clientId,
        month,
        sumHolder,
        category,
        countUntilThisDateInMonth = moment().subtract(1, 'day').format('D')
    ) => {
        month.forEach((day, index) => {
            if (index === 0 || index < countUntilThisDateInMonth) {
                const clientBalanceDay = day.clients.find(
                    client => client.id === clientId
                )
                if (clientBalanceDay) {
                    if (typeof sumHolder[index] === 'undefined') {
                        sumHolder[index] = [
                            getNumberWithHundreds(
                                calculateBalanceDaySum(
                                    clientBalanceDay,
                                    false,
                                    category
                                )
                            ),
                        ]
                    } else {
                        sumHolder[index] = [
                            ...sumHolder[index],
                            getNumberWithHundreds(
                                calculateBalanceDaySum(
                                    clientBalanceDay,
                                    false,
                                    category
                                )
                            ),
                        ]
                    }
                }
            }
        })
    }

    return {
        clientMonthSum,
        sortBySum,
        getClientsRating,
        calculateMiddleMonthSum,
        getAllAsignedTranslators,
        getArrayOfBalancePerDay,
        getTotalProfitPerClient,
    }
}
