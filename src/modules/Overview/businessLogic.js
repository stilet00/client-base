import { useCallback, useEffect, useState } from 'react'
import { getClients } from '../../services/clientsServices/services'
import { getTranslators } from '../../services/translatorsServices/services'
import { getPaymentsRequest } from '../../services/financesStatement/services'
import {
    calculateTranslatorMonthTotal,
    getNumberWithHundredths,
} from '../../sharedFunctions/sharedFunctions'
import { currentMonth, currentYear } from '../../constants/constants'

export const useOverview = user => {
    const [clients, setClients] = useState([])

    const [statements, setStatments] = useState([])

    const [translators, setTranslators] = useState([])

    const [bestMonth] = useState(null)

    const [selectedYear, setSelectedYear] = useState(currentYear)

    const handleChange = event => {
        setSelectedYear(event.target.value)
    }

    useEffect(() => {
        if (user) {
            // getBalance().then((res) => {
            //   if (res.status === 200) {
            //     let byYearFilteredArray = res.data.filter(
            //       (item) => item.year === selectedYear
            //     );
            //     let sumSortedArray =
            //       getArrayWithSums(byYearFilteredArray).sort(compareSums);
            //     setBestMonth(sumSortedArray[sumSortedArray.length - 1]);
            //   }
            // });

            getClients().then(res => {
                if (res.status === 200) {
                    setClients(res.data)
                }
            })

            getTranslators().then(res => {
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
    }, [user])

    const calculateMonthTotal = useCallback(
        (
            monthNumber = currentMonth,
            forFullMonth = true,
            onlySvadba = false
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
                            currentYear,
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
                            monthNumber
                        )
                })
            }
            return getNumberWithHundredths(sum)
        },
        [translators]
    )

    const calculateYearTotal = useCallback(() => {
        let yearSum = 0

        for (let monthNumber = 1; monthNumber < 13; monthNumber++) {
            yearSum = yearSum + calculateMonthTotal(monthNumber)
        }

        return Math.round(yearSum)
    }, [calculateMonthTotal])

    return {
        selectedYear,
        handleChange,
        clients,
        translators,
        bestMonth,
        calculateMonthTotal,
        calculateYearTotal,
        statements,
    }
}
