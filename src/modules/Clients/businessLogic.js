import { useCallback, useState } from 'react'
import { DEFAULT_CLIENT } from '../../constants/constants'
import useModal from '../../sharedHooks/useModal'
import {
    calculateBalanceDaySum,
    getMiddleValueFromArray,
    getSumFromArray,
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
    function clientMonthSum(clientId, date = moment()) {
        let totalClientBalance = 0

        translators.forEach(translator => {
            const thisYearStat = translator.statistics.find(
                year => year.year === date.format('YYYY')
            )

            const thisMonthStat = thisYearStat.months[date.format('M') - 1]

            thisMonthStat.forEach(day => {
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

        return Math.round(totalClientBalance)
    }

    function calculateMiddleMonthSum(clientId, date = moment()) {
        let monthSumArray = []

        let totalClientBalance = 0

        translators.forEach(translator => {
            const thisYearStat = translator.statistics.find(
                year => year.year === date.format('YYYY')
            )

            const thisMonthStat = thisYearStat.months[date.format('M') - 1]

            thisMonthStat.forEach((day, index) => {
                if (index === 0 || index < moment().format('D')) {
                    const clientBalanceDay = day.clients.find(
                        client => client.id === clientId
                    )

                    if (clientBalanceDay) {
                        if (typeof monthSumArray[index] === 'undefined') {
                            const dayArray = []
                            monthSumArray[index] = [
                                ...dayArray,
                                Math.round(
                                    calculateBalanceDaySum(clientBalanceDay)
                                ),
                            ]
                        } else {
                            monthSumArray[index] = [
                                ...monthSumArray[index],
                                Math.round(
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

    return {
        clientMonthSum,
        sortBySum,
        getClientsRating,
        calculateMiddleMonthSum,
    }
}
