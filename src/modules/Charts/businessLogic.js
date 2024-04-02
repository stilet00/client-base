import { useCallback, useEffect, useState } from 'react'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import {
    addMonth,
    changeChartValue,
    removeYear,
} from '../../services/balanceServices/services'
import { useAlertConfirmation } from '../../sharedComponents/AlertMessageConfirmation/hooks'
import useModal from '../../sharedHooks/useModal'
import {
    getNumberWithHundreds,
    calculateBalanceDaySum,
    getMomentUTC,
} from 'sharedFunctions/sharedFunctions'
import { useQuery } from 'react-query'
import { getBalanceDaysForChartsRequest } from 'services/balanceDayServices/index'
import {
    currentYear,
    DEFAULT_MONTH_CHART,
    previousDay,
} from '../../constants/constants'
import MESSAGES from 'constants/messages'

export const useChartsContainer = user => {
    const [months, setMonths] = useState([])

    const [selectedYear, setSelectedYear] = useState(currentYear)

    const [deletedMonth, setDeletedMonth] = useState(null)

    const [arrayOfYears, setArrayOfYears] = useState([])

    const { alertOpen, closeAlert, openAlert } = useAlert()
    const [category, setCategory] = useState(null)

    const {
        alertStatusConfirmation,
        openAlertConfirmation,
        closeAlertConfirmationNoReload,
    } = useAlertConfirmation()

    const fetchBalanceDays = async () => {
        const response = await getBalanceDaysForChartsRequest({
            yearFilter: selectedYear,
        })
        if (response.status !== 200) {
            throw new Error(MESSAGES.somethingWrongWithBalanceDays)
        }
        return response.data
    }

    const {
        data,
        isLoading: balanceDaysAreLoading,
        refetch: refetchBalanceDays,
    } = useQuery('balanceDaysForCharts', fetchBalanceDays, {
        enabled: !!user,
        onSuccess: data => {
            console.log(data)
            let yearChartsArray = []
            for (let monthCount = 1; monthCount < 13; monthCount++) {
                let defaultMonth = new DEFAULT_MONTH_CHART(
                    selectedYear,
                    monthCount
                )

                const stringMonth = defaultMonth.month

                for (
                    let dayCount = 1;
                    dayCount <=
                    getMomentUTC(
                        selectedYear + '-' + stringMonth,
                        'YYYY-MM'
                    ).daysInMonth();
                    dayCount++
                ) {
                    const currentDayDate = getMomentUTC(
                        `${dayCount}-${monthCount}-${selectedYear}`,
                        'D-M-YYYY'
                    ).format()
                    const arrayOfBalanceDayForCurrentDate = data.filter(
                        balanceDay =>
                            getMomentUTC(balanceDay.dateTimeId).isSame(
                                currentDayDate,
                                'day'
                            )
                    )
                    let daySum = arrayOfBalanceDayForCurrentDate.reduce(
                        (sum, current) => {
                            return (
                                sum + calculateBalanceDaySum(current.statistics)
                            )
                        },
                        0
                    )
                    if (daySum) {
                        defaultMonth.values[dayCount - 1] =
                            getNumberWithHundreds(daySum)
                    }
                }
                if (
                    defaultMonth.values.reduce((sum, current) => {
                        return sum + Number(current)
                    }, 0)
                ) {
                    yearChartsArray.unshift(defaultMonth)
                }
            }
            setMonths(yearChartsArray)
        },
        onError: () => console.error(MESSAGES.somethingWrongWithBalanceDays),
    })

    useEffect(() => {
        refetchBalanceDays()
    }, [selectedYear])

    const handleChange = e => {
        setSelectedYear(e.target.value)
    }

    function compareNumeric(a, b) {
        if (a.month > b.month) return 1
        if (a.month === b.month) return 0
        if (a.month < b.month) return -1
    }

    const deleteGraph = useCallback(
        id => {
            setDeletedMonth(months.find(item => item._id === id))
            openAlertConfirmation()
        },
        [months, openAlertConfirmation]
    )

    const deleteGraphClicked = useCallback(() => {
        removeYear(deletedMonth._id).then(res => {
            if (res.status === 200) {
                setMonths(months.filter(item => item._id !== deletedMonth._id))
                setDeletedMonth(null)
                closeAlertConfirmationNoReload()
            }
        })
    }, [deletedMonth, months, closeAlertConfirmationNoReload])

    const cancelDeleteGraphClicked = useCallback(() => {
        setDeletedMonth(null)
        closeAlertConfirmationNoReload()
    }, [closeAlertConfirmationNoReload])

    const onMonthSubmit = useCallback(
        date => {
            addMonth(date).then(res => {
                if (res.status === 200) {
                    openAlert()
                    setMonths(
                        [...months, { ...date, _id: res.data }]
                            .sort(compareNumeric)
                            .reverse()
                    )
                }
            })
        },
        [months, openAlert]
    )

    const onValueSubmit = useCallback(
        valueOfDay => {
            changeChartValue(valueOfDay).then(res => {
                if (res.status === 200) {
                    openAlert()
                }
            })
        },
        [openAlert]
    )

    return {
        arrayOfYears,
        selectedYear,
        handleChange,
        months,
        onValueSubmit,
        onMonthSubmit,
        deleteGraph,
        alertOpen,
        closeAlert,
        deletedMonth,
        alertStatusConfirmation,
        closeAlertConfirmationNoReload,
        openAlertConfirmation,
        cancelDeleteGraphClicked,
        deleteGraphClicked,
        category,
        setCategory,
        balanceDaysAreLoading,
    }
}

export const useChartForm = ({ onMonthSubmit, year }) => {
    const [months, setMonths] = useState([])

    const [selectedMonth, setSelectedMonth] = useState(1)

    const [valuesArray, setValuesArray] = useState([])

    const { handleClose, handleOpen, open } = useModal()

    useEffect(() => {
        let monthsArray = []
        for (let i = 1; i < 13; i++) {
            i < 10
                ? monthsArray.push(
                      getMomentUTC(
                          '01-0' + i + '-' + year,
                          'DD-MM-YYYY'
                      ).format('MMMM')
                  )
                : monthsArray.push(
                      getMomentUTC('01-' + i + '-' + year, 'DD-MM-YYYY').format(
                          'MMMM'
                      )
                  )
        }
        setMonths(monthsArray)
    }, [year])

    const handleChange = useCallback(event => {
        setSelectedMonth(event.target.value)
    }, [])

    const getTotalDays = useCallback(() => {
        const stringMonth =
            selectedMonth < 9 ? '0' + selectedMonth : selectedMonth
        let totalDays = []
        for (
            let i = 1;
            i <=
            getMomentUTC(year + '-' + stringMonth, 'YYYY-MM').daysInMonth();
            i++
        ) {
            totalDays.push(i)
        }
        return totalDays
    }, [selectedMonth, year])

    const setDefault = useCallback(() => {
        handleClose()
        let monthsArray = []
        for (let i = 1; i < 13; i++) {
            i < 10
                ? monthsArray.push(
                      getMomentUTC(
                          '01-0' + i + '-' + year,
                          'DD-MM-YYYY'
                      ).format('MMMM')
                  )
                : monthsArray.push(
                      getMomentUTC('01-' + i + '-' + year, 'DD-MM-YYYY').format(
                          'MMMM'
                      )
                  )
        }
        setMonths(monthsArray)
        setSelectedMonth(1)
        setValuesArray([])
    }, [year, handleClose])

    const onFormSubmit = useCallback(
        e => {
            e.preventDefault()
            let submittedMonth = {
                year: year,
                month:
                    selectedMonth < 10
                        ? '0' + selectedMonth
                        : String(selectedMonth),
                days: getTotalDays(),
                values: valuesArray,
            }
            onMonthSubmit(submittedMonth)
            setDefault()
        },
        [
            year,
            selectedMonth,
            valuesArray,
            getTotalDays,
            onMonthSubmit,
            setDefault,
        ]
    )

    const onValuesSubmit = useCallback(newValuesArray => {
        setValuesArray(newValuesArray)
    }, [])

    return {
        handleOpen,
        open,
        handleClose,
        onFormSubmit,
        year,
        selectedMonth,
        handleChange,
        months,
        getTotalDays,
        onValuesSubmit,
        valuesArray,
    }
}

export const useChartDateForm = ({ monthData, onValueSubmit }) => {
    const [value, setValue] = useState('')
    const [selectedDate, setSelectedDate] = useState(previousDay)
    const { handleClose, handleOpen, open } = useModal()

    const handleChange = useCallback(event => {
        setSelectedDate(event.target.value)
    }, [])

    const onInputChange = useCallback(e => {
        setValue(e.target.value)
    }, [])

    const onSubmit = e => {
        e.preventDefault()
        onValueSubmit({ selectedDate, value, id: monthData._id })
        handleClose()
    }

    return {
        handleOpen,
        open,
        handleClose,
        onSubmit,
        selectedDate,
        handleChange,
        value,
        onInputChange,
        monthData,
    }
}
