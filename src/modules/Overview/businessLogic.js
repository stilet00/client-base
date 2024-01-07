import { useEffect, useState } from 'react'
import moment from 'moment'
import { useQuery } from 'react-query'
import { getClients } from 'services/clientsServices/services'
import { getTranslators } from 'services/translatorsServices/services'
import { getBalanceDaysRequest } from 'services/balanceDayServices/index'
import { getPaymentsRequest } from 'services/financesStatement/services'
import {
    calculateTranslatorMonthTotal,
    getNumberWithHundreds,
    calculateBalanceDaySum,
} from 'sharedFunctions/sharedFunctions'
import { currentMonth, currentYear } from 'constants/constants'
import MESSAGES from 'constants/messages'

export const useOverview = user => {
    const [clients, setClients] = useState([])
    const [statements, setStatements] = useState([])
    const [translators, setTranslators] = useState([])
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [balanceDaysForSelectedYear, setBalanceDaysForSelectedYear] =
        useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = event => {
        setSelectedYear(event.target.value)
    }

    const fetchClients = async () => {
        const response = await getClients({ noImageParams: true })
        if (response.status !== 200) {
            throw new Error('Something went wrong with clients')
        }
        return response.data
    }

    const fetchTranslators = async () => {
        const response = await getTranslators({})
        if (response.status !== 200) {
            throw new Error('Something went wrong with translators')
        }
        return response.data
    }

    const fetchPayments = async () => {
        const response = await getPaymentsRequest({ yearFilter: selectedYear })
        if (response.status !== 200) {
            throw new Error('Something went wrong with payments')
        }
        return response.data
    }

    const fetchBalanceDays = async () => {
        const response = await getBalanceDaysRequest({
            yearFilter: selectedYear,
        })
        if (response.status !== 200) {
            throw new Error(MESSAGES.somethingWrongWithBalanceDays)
        }
        return response.data
    }

    const { isLoading: clientsAreLoading } = useQuery(
        'clientsForOverview',
        fetchClients,
        {
            enabled: !!user,
            onSuccess: data => setClients(data),
            onError: () => console.error('Something went wrong with clients'),
        }
    )

    const { isLoading: translatorsAreLoading } = useQuery(
        'translatorsForOverview',
        fetchTranslators,
        {
            enabled: !!user,
            onSuccess: data => setTranslators(data),
            onError: () =>
                console.error('Something went wrong with translators'),
        }
    )

    const { isLoading: paymentsAreLoading } = useQuery(
        ['paymentsForOverview', selectedYear],
        fetchPayments,
        {
            enabled: !!user,
            onSuccess: data => setStatements(data),
            onError: () => console.error('Something went wrong with payments'),
        }
    )

    const { isLoading: balanceDaysIsLoading, refetch: refetchBalanceDays } =
        useQuery('balanceDaysForOverview', fetchBalanceDays, {
            enabled: !!user,
            onSuccess: data => setBalanceDaysForSelectedYear(data),
            onError: () =>
                console.error(MESSAGES.somethingWrongWithBalanceDays),
        })

    const dataIsLoading =
        clientsAreLoading ||
        translatorsAreLoading ||
        paymentsAreLoading ||
        balanceDaysIsLoading

    const dataIsLoaded =
        !clientsAreLoading &&
        !translatorsAreLoading &&
        !paymentsAreLoading &&
        !balanceDaysIsLoading

    useEffect(() => {
        if (dataIsLoaded) {
            setIsLoading(false)
        }
        if (dataIsLoading) {
            setIsLoading(true)
        }
    }, [dataIsLoading, dataIsLoaded])

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
                const translatorStatistics = balanceDaysForSelectedYear.filter(
                    balanceDay => translator._id === balanceDay.translator
                )
                const balanceDaysForFilteredMonth = translatorStatistics.filter(
                    balanceDay =>
                        moment(balanceDay.dateTimeId).format('M') ===
                        monthNumber
                )
                if (!balanceDaysForFilteredMonth) {
                    return
                }

                sum =
                    sum +
                    calculateTranslatorMonthTotal(
                        balanceDaysForFilteredMonth,
                        forFullMonth,
                        monthNumber,
                        year,
                        onlySvadba
                    )
            })
        } else {
            translators.forEach(translator => {
                const translatorStatistics = balanceDaysForSelectedYear.filter(
                    balanceDay => translator._id === balanceDay.translator
                )
                const balanceDaysForFilteredMonth = translatorStatistics.filter(
                    balanceDay =>
                        moment(balanceDay.dateTimeId).format('M') ===
                        monthNumber
                )
                if (!balanceDaysForFilteredMonth) {
                    return
                }
                sum =
                    sum +
                    calculateTranslatorMonthTotal(
                        balanceDaysForFilteredMonth,
                        forFullMonth,
                        monthNumber,
                        year
                    )
            })
        }
        return getNumberWithHundreds(sum)
    }

    const calculateYearTotal = () => {
        const total = balanceDaysForSelectedYear?.reduce((sum, current) => {
            return sum + calculateBalanceDaySum(current.statistics)
        }, 0)
        return Math.round(total)
    }

    return {
        selectedYear,
        handleChange,
        clients,
        translators,
        calculateMonthTotal,
        calculateYearTotal,
        statements,
        isLoading,
    }
}
