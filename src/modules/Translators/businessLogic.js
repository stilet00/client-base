import { useCallback, useEffect, useState, useMemo } from 'react'
import { useQuery, useMutation } from 'react-query'
import MESSAGES from 'constants/messages'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import {
    addTranslator,
    getTranslators,
    removeTranslator,
    updateTranslator,
    sendNotificationEmailsRequest,
    sendLastVirtualGiftDateRequest,
    requestBonusesForChats,
    assignClientToTranslatorRequest,
    getBalanceDay,
    createBalanceDay,
    updateBalanceDay,
} from 'services/translatorsServices/services'
import { getCurrency } from 'services/currencyServices'
import {
    currentMonth,
    currentYear,
    EMPTY_BALANCE_DAY,
    previousMonth,
    previousYear,
} from 'constants/constants'

import {
    getClients,
    removeClient,
} from '../../services/clientsServices/services'
import { useAlertConfirmation } from '../../sharedComponents/AlertMessageConfirmation/hooks'
import moment from 'moment'
import useModal from '../../sharedHooks/useModal'
import {
    calculateBalanceDayAllClients,
    calculateBalanceDaySum,
    calculateTranslatorMonthTotal,
    getMiddleValueFromArray,
    getNumberWithHundreds,
} from '../../sharedFunctions/sharedFunctions'

export const useTranslators = user => {
    const [clients, setClients] = useState([])
    const [chatsBonus, setChatsBonus] = useState([])

    const [translators, setTranslators] = useState([])

    const [currentClient, setCurrentClient] = useState(null)
    const [dollarToUahRate, setDollarToUahRate] = useState(null)

    const [state, setState] = useState({
        left: false,
    })

    const [loading, setLoading] = useState(true)

    const [mailoutInProgress, setMailoutInProgress] = useState(false)

    const { alertOpen, closeAlert, openAlert, message, setMessage } = useAlert()

    const [deletedTranslator, setDeletedTranslator] = useState(null)

    const [translatorFilter, setTranslatorFilter] = useState({
        suspended: true,
        date: moment().subtract(1, 'month'),
    })

    const {
        alertStatusConfirmation,
        openAlertConfirmation,
        closeAlertConfirmationNoReload,
    } = useAlertConfirmation()

    const changeFilter = useCallback(
        e => {
            if (e.target) {
                const newFilter = {
                    ...translatorFilter,
                    [e.target.name]: !translatorFilter[e.target.name],
                }

                setTranslatorFilter(newFilter)
            } else {
                setTranslatorFilter({ ...translatorFilter, date: e })
            }
        },
        [translatorFilter]
    )

    const filterTranslators = useCallback(() => {
        if (translatorFilter.suspended) {
            return translators.filter(
                translator =>
                    translator.suspended.status !== translatorFilter.suspended
            )
        } else {
            return translators
        }
    }, [translators, translatorFilter])

    const memoizedFilteredTranslators = useMemo(
        () => filterTranslators(),
        [translators, translatorFilter]
    )

    useEffect(() => {
        ;(async () => {
            if (user) {
                const responseWithCurrency = await getCurrency()
                if (responseWithCurrency.status === 200) {
                    const privatBankDollarRate =
                        responseWithCurrency?.data[1]?.buy ?? '36.57'
                    setDollarToUahRate(privatBankDollarRate)
                } else {
                    openAlert(MESSAGES.somethingWrongWithCurrencies)
                }
                const responseTranslators = await getTranslators({
                    shouldGetClients: true,
                })
                if (responseTranslators.status === 200) {
                    setTranslators(responseTranslators.data)
                } else {
                    openAlert(MESSAGES.somethingWrongWithGettingTranslators)
                }
                const responseClients = await getClients({
                    noImageParams: true,
                })
                if (responseClients.status === 200) {
                    setClients(responseClients.data)
                } else {
                    openAlert(MESSAGES.somethingWrongWithGettingClients)
                }
                setLoading(false)
            }
        })()
    }, [user])

    const toggleDrawer = useCallback(
        (anchor, open) => event => {
            if (
                event.type === 'keydown' &&
                (event.key === 'Tab' || event.key === 'Shift')
            ) {
                return
            }
            setState({ ...state, [anchor]: open })
        },
        [state]
    )

    const dragStartHandler = useCallback((e, client) => {
        setCurrentClient(client)
        e.target.style.border = '2px solid black'
    }, [])

    const dragLeaveHandler = useCallback(e => {
        setState({ left: false })
        if (e.target.tagName === 'UL') {
            e.target.style.background = 'none'
        } else if (e.target.tagName === 'LI') {
            e.target.parentNode.style.background = 'none'
        }
    }, [])

    const dragEndHandler = useCallback(e => {
        e.target.style.background = 'none'
    }, [])

    const dragOverHandler = useCallback(e => {
        e.preventDefault()
        if (e.target.tagName === 'UL') {
            e.target.style.background = 'rgba(255,255,255, 0.5)'
        } else if (e.target.tagName === 'LI') {
            e.target.parentNode.style.background = 'rgba(255,255,255, 0.5)'
        }
    }, [])

    const dragDropHandler = useCallback((e, task, board) => {
        e.preventDefault()
        e.target.style.background = 'none'
    }, [])

    const saveChangedTranslator = useCallback(
        async (editedTranslator, message) => {
            try {
                const res = await updateTranslator(editedTranslator)
                if (res.status === 200) {
                    openAlert(message)
                    setTranslators(
                        translators.map(item =>
                            item._id === editedTranslator._id
                                ? editedTranslator
                                : item
                        )
                    )
                }
            } catch (error) {
                const erroMessageForShowAlertMessage = {
                    text: error?.response?.data?.error || 'An error occurred',
                    status: false,
                }
                openAlert(erroMessageForShowAlertMessage, 5000)
                console.error('An error occurred:', error)
            }
        },
        [translators, openAlert]
    )

    const assignClientToTranslator = async ({ translatorId, clientId }) => {
        let editedTranslator = translators.find(
            item => item._id === translatorId
        )
        if (
            editedTranslator.clients.some(
                item => item._id === currentClient._id
            )
        ) {
            openAlert(MESSAGES.clientExist)
            return
        }
        const responseFromAssignClientToTranslator =
            await assignClientToTranslatorRequest({ translatorId, clientId })
        if (responseFromAssignClientToTranslator.status === 200) {
            const editedTranslator = translators.find(
                item => item._id === translatorId
            )
            editedTranslator.clients.push({
                ...currentClient,
            })
            setTranslators(
                translators.map(item =>
                    item._id === editedTranslator._id ? editedTranslator : item
                )
            )
        }
        if (responseFromAssignClientToTranslator.status !== 200) {
            openAlert(MESSAGES.somethingWrongWithAssigningClient)
        }
    }

    const onBoardDrop = useCallback(
        async (e, translatorID) => {
            e.preventDefault()
            if (e.target.tagName === 'UL') {
                e.target.style.background = 'none'
            } else if (e.target.tagName === 'LI') {
                e.target.parentNode.style.background = 'none'
            }
            await assignClientToTranslator({
                translatorId: translatorID,
                clientId: currentClient._id,
            })
        },
        [translators, currentClient, openAlert, openAlert]
    )

    const deleteClient = useCallback(
        id => {
            removeClient(id).then(res => {
                if (res.status === 200) {
                    openAlert(MESSAGES.clientDeleted)
                    setClients(clients.filter(item => item._id !== id))
                } else {
                    openAlert(MESSAGES.somethingWrong)
                }
            })
        },
        [clients, openAlert]
    )

    const startTranslatorDelete = useCallback(
        id => {
            const translator = translators.find(item => item._id === id)

            setDeletedTranslator(translator)

            setMessage({
                text: `You are deleting ${translator.name} ${translator.surname}`,
                status: false,
            })

            openAlertConfirmation()
        },
        [translators, openAlertConfirmation]
    )

    const finishTranslatorDelete = useCallback(() => {
        removeTranslator(deletedTranslator._id).then(res => {
            if (res.status === 200) {
                closeAlertConfirmationNoReload()
                setTranslators(
                    translators.filter(
                        item => item._id !== deletedTranslator._id
                    )
                )
                setMessage(MESSAGES.addTranslator)
            } else {
                openAlert(MESSAGES.somethingWrong)
            }
        })
    }, [
        translators,
        openAlert,
        closeAlertConfirmationNoReload,
        deletedTranslator,
    ])

    const sendNotificationEmails = () => {
        setMailoutInProgress(true)
        sendNotificationEmailsRequest()
            .then(res => {
                if (res.status === 200) {
                    closeAlertConfirmationNoReload()
                    const messageAboutEmailsReceived = {
                        text: `Emails have been sent to: ${res.data.join(
                            ', '
                        )}`,
                        status: true,
                    }
                    openAlert(messageAboutEmailsReceived, 20000)
                    setMailoutInProgress(false)
                }
            })
            .catch(error => {
                closeAlertConfirmationNoReload()
                const erroMessageForShowAlertMessage = {
                    text: error?.response?.data?.error || 'An error occurred',
                    status: false,
                }
                openAlert(erroMessageForShowAlertMessage, 5000) // Handle error case
                console.error('An error occurred:', error) // Log the error for debugging
                setMailoutInProgress(false)
            })
    }

    const translatorsFormSubmit = async newTranslator => {
        const { data, status } = await addTranslator(newTranslator)
        if (status === 200) {
            openAlert(MESSAGES.addTranslator)
            setTranslators([...translators, { ...newTranslator, _id: data }])
        } else {
            openAlert(MESSAGES.somethingWrong, 5000)
        }
    }

    const calculateMonthTotal = useCallback(
        (categoryName = null) => {
            let sum = 0
            if (categoryName) {
                translators.forEach(translator => {
                    let translatorsStatistic = translator.statistics
                    sum =
                        sum +
                        Number(
                            calculateTranslatorMonthTotal(
                                translatorsStatistic,
                                true,
                                currentMonth,
                                currentYear,
                                false,
                                categoryName
                            )
                        )
                })
            } else {
                translators.forEach(translator => {
                    let translatorsStatistic = translator.statistics
                    sum =
                        sum +
                        Number(
                            calculateTranslatorMonthTotal(translatorsStatistic)
                        )
                })
            }
            return getNumberWithHundreds(sum)
        },
        [translators]
    )

    const suspendTranslator = useCallback(
        translatorId => {
            let editedTranslator = translators.find(
                translator => translator._id === translatorId
            )

            editedTranslator = {
                ...editedTranslator,
                suspended: {
                    status: !editedTranslator.suspended.status,
                    time: moment().format('DD MMMM YYYY'),
                },
            }

            const message = editedTranslator.suspended.status
                ? MESSAGES.translatorSuspended
                : MESSAGES.translatorActivated

            saveChangedTranslator(editedTranslator, message)
        },
        [translators]
    )

    const addPersonalPenaltyToTranslator = useCallback(
        (id, penalty) => {
            let editedTranslator = translators.find(
                translator => translator._id === id
            )
            if (editedTranslator.personalPenalties) {
                editedTranslator = {
                    ...editedTranslator,
                    personalPenalties: [
                        ...editedTranslator.personalPenalties,
                        penalty,
                    ],
                }
            } else {
                editedTranslator = {
                    ...editedTranslator,
                    personalPenalties: [penalty],
                }
            }
            saveChangedTranslator(
                editedTranslator,
                MESSAGES.personalPenaltyApplied
            )
        },
        [translators]
    )

    const suspendClient = useCallback(
        (translatorId, clientId) => {
            const editedTranslator = translators.find(
                item => item._id === translatorId
            )
            let message

            editedTranslator.clients = editedTranslator.clients.map(client => {
                if (client._id === clientId) {
                    message = client.suspended
                        ? MESSAGES.clientActivated
                        : MESSAGES.clientSuspended
                    return { ...client, suspended: !client.suspended }
                } else {
                    return client
                }
            })

            saveChangedTranslator(editedTranslator, message)
        },
        [translators]
    )

    const updateTranslatorEmail = useCallback(
        (email, id, wantsToReceiveEmails) => {
            let editedTranslator = translators.find(item => item._id === id)
            editedTranslator = {
                ...editedTranslator,
                email,
                wantsToReceiveEmails,
            }
            saveChangedTranslator(
                editedTranslator,
                MESSAGES.translatorEmailUpdated
            )
        },
        [translators]
    )
    const getBonusesForChats = (
        date = translatorFilter?.date,
        category = 'chats'
    ) => {
        const data = {
            year: date.format('YYYY'),
            month: date.format('M'),
            category,
        }
        requestBonusesForChats(data)
            .then(res => {
                if (res.status === 200) {
                    setChatsBonus(res.data)
                }
            })
            .catch(err => {
                setChatsBonus([])
            })
    }

    return {
        translators,
        setTranslators,
        startTranslatorDelete,
        dragOverHandler,
        onBoardDrop,
        dragLeaveHandler,
        loading,
        toggleDrawer,
        state,
        clients,
        dragEndHandler,
        dragStartHandler,
        dragDropHandler,
        deleteClient,
        translatorsFormSubmit,
        message,
        alertOpen,
        openAlert,
        closeAlert,
        alertStatusConfirmation,
        openAlertConfirmation,
        closeAlertConfirmationNoReload,
        finishTranslatorDelete,
        calculateMonthTotal,
        suspendTranslator,
        suspendClient,
        changeFilter,
        memoizedFilteredTranslators,
        translatorFilter,
        addPersonalPenaltyToTranslator,
        updateTranslatorEmail,
        sendNotificationEmails,
        mailoutInProgress,
        dollarToUahRate,
        chatsBonus,
        getBonusesForChats,
    }
}

export const useBalanceForm = ({ clients, translatorId }) => {
    const { open, handleOpen, handleClose } = useModal()
    const [selectedClient, setSelectedClient] = useState(
        clients.filter(client => !client.suspended)[0]?._id
    )
    const [selectedYear, setSelectedYear] = useState(
        moment().subtract(1, 'day').format('YYYY')
    )
    const [selectedMonth, setSelectedMonth] = useState(
        moment().subtract(1, 'day').format('M')
    )
    const [selectedDay, setSelectedDay] = useState(
        moment().subtract(1, 'day').format('D')
    )
    const [currentBalanceDay, setCurrentBalanceDay] = useState(null)
    const { alertOpen, closeAlert, openAlert, message } = useAlert()
    const balanceDayQuery = useQuery(
        [
            'balanceDay',
            selectedYear,
            selectedMonth,
            selectedDay,
            translatorId,
            selectedClient,
        ],
        () =>
            getBalanceDay({
                translatorId,
                clientId: selectedClient,
                dateTimeId: `${selectedDay} ${selectedMonth} ${selectedYear}`,
            }),
        {
            onSuccess: response => {
                const balanceDayExists = !!response?.data
                if (balanceDayExists) {
                    setCurrentBalanceDay(response.data)
                }
                if (!balanceDayExists) {
                    const emptyBalanceDay = new EMPTY_BALANCE_DAY()
                    setCurrentBalanceDay({
                        ...emptyBalanceDay,
                        dateTimeId: `${selectedDay} ${selectedMonth} ${selectedYear}`,
                        client: { _id: selectedClient },
                        translator: { _id: translatorId },
                    })
                }
            },
            onError: error => {
                openAlert(MESSAGES.somethingWrongWithGettingBalanceDay)
            },
        }
    )

    const balanceDayMutation = useMutation(
        balanceDayToSubmit => {
            if (!balanceDayToSubmit._id) {
                return createBalanceDay({ newBalanceDay: balanceDayToSubmit })
            }
            if (balanceDayToSubmit._id) {
                return updateBalanceDay({ balanceDayToSubmit })
            }
        },
        {
            onSuccess: response => {
                setCurrentBalanceDay(response.data)
                openAlert(MESSAGES.balanceDayHaveBeenSaved)
            },
            onError: error => {
                console.log(error)
                openAlert(MESSAGES.somethingWentWrongWithSavingBalanceDay)
            },
        }
    )
    const balanceDaySubmit = ({ currentBalanceDay }) => {
        balanceDayMutation.mutate(currentBalanceDay)
    }

    const handleYearChange = event => {
        setSelectedYear(event.target.value)
    }

    const handleMonthChange = event => {
        setSelectedMonth(event.target.value)
    }

    const handleDayChange = event => {
        setSelectedDay(event.target.value)
    }

    const handleClientChange = e => {
        setSelectedClient(e.target.value)
    }

    const handleChange = useCallback(
        e => {
            const editedBalanceDay = {
                ...currentBalanceDay,
                statistics: {
                    ...currentBalanceDay.statistics,
                    [e.target.name]:
                        e.target.type === 'textarea'
                            ? e.target.value
                            : Number(e.target.value),
                },
            }
            setCurrentBalanceDay(editedBalanceDay)
        },
        [selectedClient, currentBalanceDay]
    )
    return {
        handleOpen,
        open,
        handleClose,
        selectedYear,
        handleYearChange,
        selectedMonth,
        handleMonthChange,
        selectedDay,
        handleDayChange,
        selectedClient,
        handleClientChange,
        handleChange,
        currentBalanceDay,
        messageFromBalanceDayForm: message,
        alertOpen,
        closeAlert,
        openAlert,
        balanceDaySubmit,
        getBalanceDayIsLoading:
            balanceDayQuery.isLoading || balanceDayMutation.isLoading,
    }
}

export const useSingleTranslator = (
    statistics,
    selectedDate,
    personalPenalties
) => {
    const [lastVirtualGiftDate, setLastVirtualGiftDate] = useState(null)
    const [giftRequestLoader, setGiftRequestLoader] = useState(false)
    const calculateTranslatorYesterdayTotal = statistics => {
        const day = statistics
            .find(
                year => year.year === moment().subtract(1, 'day').format('YYYY')
            )
            ?.months.find(
                (month, index) =>
                    index + 1 ===
                    Number(moment().subtract(1, 'day').format('M'))
            )
            .find(day => {
                return (
                    day.id ===
                        moment().subtract(1, 'day').format('DD MM YYYY') ||
                    day.id === moment().format('DD MM YYYY')
                )
            })
        return calculateBalanceDayAllClients(day)
    }

    const calculatePersonalPenalties = () => {
        const thisMonthsPenaltiesArray = []
        const selectedDatePenaltiesArray = []
        personalPenalties?.forEach(penalty => {
            if (moment().format('MM YYYY') === penalty.date.slice(3)) {
                thisMonthsPenaltiesArray.push(Number(penalty.amount))
            }
            if (selectedDate.format('MM YYYY') === penalty.date.slice(3)) {
                selectedDatePenaltiesArray.push(Number(penalty.amount))
            }
        })

        return thisMonthsPenaltiesArray.length ||
            selectedDatePenaltiesArray.length
            ? {
                  thisMonthsPenaltiesArray,
                  selectedDatePenaltiesArray,
              }
            : null
    }

    const calculateTranslatorDayTotal = statistics => {
        const day = statistics
            .find(year => year.year === selectedDate.format('YYYY'))
            ?.months.find(
                (month, index) => index + 1 === Number(selectedDate.format('M'))
            )
            .find(day => {
                return day.id === selectedDate.format('DD MM YYYY')
            })
        return calculateBalanceDayAllClients(day)
    }

    function findYesterdayStatisticObject() {
        const yearStatistics = statistics.find(
            item => item.year === moment().format('YYYY')
        )
        const monthStatistics = yearStatistics?.months.find(
            (item, index) =>
                index + 1 === Number(moment().subtract(1, 'day').format('M'))
        )
        const yesterdayStatistics = monthStatistics.find(
            item => item.id === moment().subtract(1, 'day').format('DD MM YYYY')
        )
        return yesterdayStatistics
    }

    function findYear(yearFilter = currentYear) {
        return statistics.find(item => item.year === yearFilter)
    }

    function findMonth(monthFilter = currentMonth) {
        return findYear()?.months.find(
            (item, index) => index + 1 === Number(monthFilter)
        )
    }

    function calculateSumByClient(clientId) {
        const clientObject = findYesterdayStatisticObject()?.clients.find(
            item => item.id === clientId
        )
        return clientObject
            ? calculateBalanceDaySum(clientObject).toFixed(2)
            : null
    }

    function calculateMiddleMonthSum(monthFilter) {
        let sum = []

        findMonth(monthFilter).forEach((day, index) => {
            if (index === 0 || index + 1 < moment().format('D')) {
                sum.push(Number(calculateBalanceDayAllClients(day)))
            }
        })

        return getMiddleValueFromArray(sum)
    }

    function getTranslatorsRating() {
        const middle = calculateMiddleMonthSum()

        return middle >= 100
            ? 5
            : middle >= 75
            ? 4
            : middle >= 50
            ? 3
            : middle >= 30
            ? 2
            : 1
    }

    function specialColorNeeded(clientId) {
        const clientObject = findYesterdayStatisticObject()?.clients.find(
            item => item.id === clientId
        )

        if (clientObject.virtualGiftsSvadba) {
            return 'clients-list__finance-container--pink_text'
        } else if (clientObject.virtualGiftsDating) {
            return 'clients-list__finance-container--green_text'
        } else if (clientObject.phoneCalls) {
            return 'clients-list__finance-container--blue_text'
        } else if (clientObject.penalties) {
            return 'clients-list__finance-container--red_text'
        } else {
            return ''
        }
    }

    function getLastVirtualGiftDate(translatorId) {
        setGiftRequestLoader(true)
        sendLastVirtualGiftDateRequest(translatorId)
            .then(res => {
                setLastVirtualGiftDate(res.data[0]?.date || 'No gifts found')
                setGiftRequestLoader(false)
            })
            .catch(err => {
                console.log(err.message)
                setGiftRequestLoader(false)
            })
    }

    return {
        calculateSumByClient,
        specialColorNeeded,
        getTranslatorsRating,
        calculateMiddleMonthSum,
        calculateTranslatorYesterdayTotal,
        calculateTranslatorDayTotal,
        calculatePersonalPenalties,
        getLastVirtualGiftDate,
        lastVirtualGiftDate,
        giftRequestLoader,
    }
}
