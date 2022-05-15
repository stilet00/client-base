import { useCallback, useEffect, useState } from 'react'
import { getClients } from '../../services/clientsServices/services'
import { getTranslators } from '../../services/translatorsServices/services'
import { calculateTranslatorMonthTotal } from '../../sharedFunctions/sharedFunctions'
import { currentMonth, currentYear } from '../../constants/constants'

export const useOverview = user => {
    const [globalState, setGlobalState] = useState({
        clients: [],
        translators: [],
    })

    const [selectedYear, setSelectedYear] = useState(currentYear)

    const handleChange = event => {
        setSelectedYear(event.target.value)
    }

    useEffect(() => {
        if (user) {
            async function fetchData() {
                let newState = globalState
                await getClients().then(res => {
                    if (res.status === 200) {
                        newState = { ...newState, clients: res.data }
                    }
                })

                await getTranslators().then(res => {
                    if (res.status === 200) {
                        newState = { ...newState, translators: res.data }
                    }
                })
                return newState
            }
            fetchData().then(data => setGlobalState(data))
        }
    }, [selectedYear, user])

    const calculateMonthTotal = useCallback(
        (
            monthNumber = currentMonth,
            forFullMonth = true,
            onlySvadba = false
        ) => {
            let sum = 0

            if (onlySvadba) {
                globalState.translators.forEach(translator => {
                    let translatorsStatistic = translator.statistics
                    sum =
                        sum +
                        calculateTranslatorMonthTotal(
                            translatorsStatistic,
                            forFullMonth,
                            monthNumber,
                            currentYear,
                            onlySvadba
                        )
                })
            } else {
                globalState.translators.forEach(translator => {
                    let translatorsStatistic = translator.statistics
                    sum =
                        sum +
                        calculateTranslatorMonthTotal(
                            translatorsStatistic,
                            forFullMonth,
                            monthNumber
                        )
                })
            }
            return Math.round(sum)
        },
        [globalState]
    )

    const calculateYearTotal = useCallback(() => {
        let yearSum = 0

        for (let monthNumber = 1; monthNumber < 13; monthNumber++) {
            yearSum = yearSum + calculateMonthTotal(monthNumber)
        }

        return yearSum
    }, [globalState])

    return {
        selectedYear,
        handleChange,
        clients: globalState.clients,
        translators: globalState.translators,
        calculateMonthTotal,
        calculateYearTotal,
    }
}
