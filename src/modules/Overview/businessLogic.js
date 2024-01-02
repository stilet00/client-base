import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getClients } from 'services/clientsServices/services'
import { getTranslators } from 'services/translatorsServices/services'
import { getBalanceDaysRequest } from 'services/balanceDayServices/index'
import { getPaymentsRequest } from 'services/financesStatement/services'
import {
    calculateTranslatorMonthTotal,
    getNumberWithHundreds,
} from 'sharedFunctions/sharedFunctions'
import { currentMonth, currentYear } from 'constants/constants'
import MESSAGES from 'constants/messages'

export const useOverview = user => {
    const [clients, setClients] = useState([])
    const [statements, setStatments] = useState([])
    const [translators, setTranslators] = useState([])
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [balanceDays, setBalanceDays] = useState([])

    const handleChange = event => {
        setSelectedYear(event.target.value)
    }

    useEffect(() => {
        if (user) {
            getClients({ noImageParams: true }).then(res => {
                if (res.status === 200) {
                    setClients(res.data)
                }
            })

            getTranslators({}).then(res => {
                if (res.status === 200) {
                    setTranslators(res.data)
                }
            })

            getPaymentsRequest({ yearFilter: selectedYear }).then(res => {
                if (res.status === 200) {
                    setStatments(res.data)
                }
            })
        }
    }, [user, selectedYear])

    const fetchBalanceDays = async () => {
        const response = await getBalanceDaysRequest({
            yearFilter: selectedYear,
        })
        if (response.status !== 200) {
            throw new Error(MESSAGES.somethingWrongWithBalanceDays)
        }
        return response.data
    }
    const { isLoading: balanceDaysIsLoading, refetch: refetchBalanceDays } =
        useQuery('balanceDays', fetchBalanceDays, {
            enabled: !!user,
            onSuccess: data => setBalanceDays(data),
            onError: () =>
                console.error(MESSAGES.somethingWrongWithBalanceDays),
        })

    useEffect(() => {
        refetchBalanceDays()
    }, [selectedYear])

    const calculateMonthTotal = (
        monthNumber = currentMonth,
        forFullMonth = true,
        onlySvadba = false,
        year = selectedYear
    ) => {
        let sum = 0
        if (onlySvadba) {
            translators.forEach(translator => {
                const translatorStatistics = balanceDays.filter(
                    balanceDay => translator._id === balanceDay.translator
                )
                if (!translatorStatistics) {
                    return
                }
                let translatorsStatistic = translator.statistics
                sum =
                    sum +
                    calculateTranslatorMonthTotal(
                        translatorsStatistic,
                        forFullMonth,
                        monthNumber,
                        year,
                        onlySvadba
                    )
            })
        } else {
            translators.forEach(translator => {
                const translatorStatistics = balanceDays.filter(
                    balanceDay => translator._id === balanceDay.translator
                )
                if (!translatorStatistics) {
                    return
                }
                sum =
                    sum +
                    calculateTranslatorMonthTotal(
                        translatorStatistics,
                        forFullMonth,
                        monthNumber,
                        year
                    )
            })
        }
        return getNumberWithHundreds(sum)
    }

    const calculateYearTotal = () => {
        let yearSum = 0

        for (let monthNumber = 1; monthNumber < 13; monthNumber++) {
            yearSum = yearSum + calculateMonthTotal(monthNumber)
        }

        return Math.round(yearSum)
    }

    return {
        selectedYear,
        handleChange,
        clients,
        translators,
        calculateMonthTotal,
        calculateYearTotal,
        statements,
    }
}
