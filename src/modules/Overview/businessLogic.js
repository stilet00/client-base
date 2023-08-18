import { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { getClients } from '../../services/clientsServices/services'
import { getTranslators } from '../../services/translatorsServices/services'
import { getPaymentsRequest } from '../../services/financesStatement/services'
import {
    calculateTranslatorMonthTotal,
    getNumberWithHundreds,
} from '../../sharedFunctions/sharedFunctions'
import { currentMonth, currentYear } from '../../constants/constants'

export const useOverview = user => {
    const [clients, setClients] = useState([])
    const match = useRouteMatch()
    const [statements, setStatments] = useState([])

    const [translators, setTranslators] = useState([])

    const [selectedYear, setSelectedYear] = useState(currentYear)

    const handleChange = event => {
        setSelectedYear(event.target.value)
    }

    useEffect(() => {
        if (user) {
            getClients(match.path.slice(1)).then(res => {
                if (res.status === 200) {
                    setClients(res.data)
                }
            })

            getTranslators(selectedYear).then(res => {
                if (res.status === 200) {
                    setTranslators(res.data)
                }
            })

            getPaymentsRequest().then(res => {
                if (res.status === 200) {
                    setStatments(res.data)
                }
            })
        }
    }, [user, selectedYear])

    const calculateMonthTotal = (
        monthNumber = currentMonth,
        forFullMonth = true,
        onlySvadba = false,
        year = selectedYear
    ) => {
        let sum = 0
        if (onlySvadba) {
            translators.forEach(translator => {
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
                let translatorsStatistic = translator.statistics
                sum =
                    sum +
                    calculateTranslatorMonthTotal(
                        translatorsStatistic,
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
