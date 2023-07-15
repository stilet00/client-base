import { useCallback, useEffect, useState } from 'react'
import { MESSAGES } from '../../constants/messages'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import {
    addTranslator,
    getTranslators,
    removeTranslator,
    updateTranslator,
    sendNotificationEmailsRequest,
    sendLastVirtualGiftDateRequest,
    requestBonusesForChats,
} from '../../services/translatorsServices/services'
import { getCurrency } from '../../services/currencyServices'
import {
    currentMonth,
    currentYear,
    DEFAULT_DAY_CLIENT,
    previousMonth,
    previousYear,
} from '../../constants/constants'

import {
    addClient,
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
    const [message, setMessage] = useState(MESSAGES.addTranslator)

    const [clients, setClients] = useState([])

    const [translators, setTranslators] = useState([])

    const [currentClient, setCurrentClient] = useState(null)
    const [dollarToUahRate, setDollarToUahRate] = useState(null)

    const [state, setState] = useState({
        left: false,
    })

    const [loading, setLoading] = useState(true)

    const [mailoutInProgress, setMailoutInProgress] = useState(false)

    const { alertOpen, closeAlert, openAlert } = useAlert()

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

    useEffect(() => {
        ;(async () => {
            if (user) {
                getCurrency()
                    .then(res => {
                        if (res.status === 200) {
                            const privatBankDollarRate =
                                res?.data[1]?.buy ?? '36.57'
                            setDollarToUahRate(privatBankDollarRate)
                        }
                    })
                    .catch(err => {
                        showAlertMessage(err.message)
                    })
                const responseTranslators = await getTranslators()
                if (responseTranslators.status === 200) {
                    setTranslators(responseTranslators.data)
                } else {
                    showAlertMessage(MESSAGES.somethingWrong)
                }
                const responseClients = await getClients()
                if (responseClients.status === 200) {
                    setClients(responseClients.data)
                } else {
                    showAlertMessage(MESSAGES.somethingWrong)
                }
                setLoading(false)
            }
        })()
    }, [user])

    const showAlertMessage = useCallback(
        (alertMessage, duration) => {
            setMessage(alertMessage)
            openAlert({ duration })
        },
        [openAlert]
    )

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
        (editedTranslator, message) => {
            updateTranslator(editedTranslator).then(res => {
                if (res.status === 200) {
                    showAlertMessage(message)
                    setTranslators(
                        translators.map(item => {
                            return item._id === editedTranslator._id
                                ? editedTranslator
                                : item
                        })
                    )
                } else {
                    showAlertMessage(MESSAGES.somethingWrong)
                    console.log(res.data)
                }
            })
        },
        [translators, showAlertMessage]
    )

    const onBoardDrop = useCallback(
        (e, translatorID) => {
            e.preventDefault()
            if (e.target.tagName === 'UL') {
                e.target.style.background = 'none'
            } else if (e.target.tagName === 'LI') {
                e.target.parentNode.style.background = 'none'
            }

            let editedTranslator = translators.find(
                item => item._id === translatorID
            )

            if (
                editedTranslator.clients.filter(
                    item => item._id === currentClient._id
                ).length > 0
            ) {
                showAlertMessage(MESSAGES.clientExist)
            } else {
                editedTranslator = insertClient(editedTranslator, currentClient)
                saveChangedTranslator(
                    editedTranslator,
                    MESSAGES.translatorFilled
                )
            }
        },
        [translators, currentClient, showAlertMessage, showAlertMessage]
    )

    const insertClient = useCallback((translator, client) => {
        const clientBalanceDay = new DEFAULT_DAY_CLIENT(client._id)
        const updatedStatistics = translator.statistics.map(item => {
            if (item.year === currentYear) {
                const updatedMonths = item.months.map((month, index) => {
                    if (index + 1 >= Number(currentMonth)) {
                        return month.map(day => {
                            return {
                                ...day,
                                clients: [...day.clients, clientBalanceDay],
                            }
                        })
                    } else {
                        return month
                    }
                })
                return { ...item, months: updatedMonths }
            } else {
                return item
            }
        })

        translator = {
            ...translator,
            statistics: updatedStatistics,
            clients: [...translator.clients, client],
        }

        return translator
    }, [])

    const deleteClient = useCallback(
        id => {
            removeClient(id).then(res => {
                if (res.status === 200) {
                    showAlertMessage(MESSAGES.clientDeleted)
                    setClients(clients.filter(item => item._id !== id))
                } else {
                    showAlertMessage(MESSAGES.somethingWrong)
                    console.log(res.data)
                }
            })
        },
        [clients, showAlertMessage]
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
                showAlertMessage(MESSAGES.somethingWrong)
                console.log(res.data)
            }
        })
    }, [
        translators,
        showAlertMessage,
        closeAlertConfirmationNoReload,
        deletedTranslator,
    ])

    const sendNotificationEmails = () => {
        setMailoutInProgress(true)
        sendNotificationEmailsRequest().then(res => {
            if (res.status === 200) {
                closeAlertConfirmationNoReload()
                const messageAboutEmailsReceived = {
                    text: `Emails have been sent to: ${res.data.join(', ')}`,
                    status: true,
                }
                showAlertMessage(messageAboutEmailsReceived, 20000)
                setMailoutInProgress(false)
            } else {
                showAlertMessage(MESSAGES.somethingWrong)
                setMailoutInProgress(false)
                console.log(res.data)
            }
        })
    }

    const translatorsFormSubmit = useCallback(
        (e, newTranslator) => {
            e.preventDefault()
            if (
                translators.filter(existingTranslator => {
                    return (
                        existingTranslator.name.toLowerCase() ===
                            newTranslator.name.toLowerCase() &&
                        existingTranslator.surname.toLowerCase() ===
                            newTranslator.surname.toLowerCase()
                    )
                }).length
            ) {
                showAlertMessage(MESSAGES.translatorExist)
            } else {
                showAlertMessage(MESSAGES.addTranslator)
                addTranslator(newTranslator).then(res => {
                    if (res.status === 200) {
                        setTranslators([
                            ...translators,
                            { ...newTranslator, _id: res.data },
                        ])
                    } else {
                        console.log(res.status)
                    }
                })
            }
        },
        [translators, showAlertMessage]
    )

    const clientsFormSubmit = useCallback(
        (e, newClient) => {
            e.preventDefault()

            addClient(newClient).then(res => {
                if (res.status === 200) {
                    showAlertMessage(MESSAGES.addClient)
                    setClients([...clients, { ...newClient, _id: res.data }])
                } else {
                    showAlertMessage(MESSAGES.somethingWrong)
                    console.log(res.data)
                }
            })
        },
        [clients, showAlertMessage]
    )

    const balanceDaySubmit = useCallback(
        (translatorId, balanceDay) => {
            let editedTranslator = translators.find(
                item => item._id === translatorId
            )
            const newStatistics = editedTranslator.statistics.map(year => {
                const newMonths = year.months.map(month => {
                    return month.map(day => {
                        return day.id === balanceDay.id ? balanceDay : day
                    })
                })
                return { ...year, months: newMonths }
            })

            editedTranslator.statistics = newStatistics
            saveChangedTranslator(editedTranslator, MESSAGES.changesSaved)
        },
        [translators]
    )

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
        clientsFormSubmit,
        translatorsFormSubmit,
        message,
        alertOpen,
        openAlert,
        closeAlert,
        balanceDaySubmit,
        alertStatusConfirmation,
        openAlertConfirmation,
        closeAlertConfirmationNoReload,
        finishTranslatorDelete,
        calculateMonthTotal,
        suspendTranslator,
        suspendClient,
        changeFilter,
        filterTranslators,
        translatorFilter,
        addPersonalPenaltyToTranslator,
        updateTranslatorEmail,
        sendNotificationEmails,
        mailoutInProgress,
        dollarToUahRate,
    }
}

export const useBalanceForm = ({ balanceDaySubmit, statistics, clients }) => {
    const { open, handleOpen, handleClose } = useModal()

    const [selectedClient, setSelectedClient] = useState(
        clients.filter(client => !client.suspended)[0]._id
    )

    const [selectedYear, setSelectedYear] = useState(
        currentMonth === '1' && moment().format('D') === '1'
            ? previousYear
            : currentYear
    )

    const [selectedMonth, setSelectedMonth] = useState(
        moment().format('D') === '1' ? previousMonth : currentMonth
    )

    const [selectedDay, setSelectedDay] = useState(
        moment().subtract(1, 'day').format('D')
    )

    const [currentBalanceDay, setCurrentBalanceDay] = useState(
        findTodayBalance()
    )

    useEffect(() => {
        setCurrentBalanceDay(findTodayBalance())
    }, [selectedYear, selectedMonth, selectedDay, statistics])

    function findYear() {
        return statistics.find(item => item.year === selectedYear)
    }

    function findMonth() {
        return findYear().months.find(
            (item, index) => index + 1 === Number(selectedMonth)
        )
    }

    function findTodayBalance() {
        return findMonth().find(
            (item, index) => index + 1 === Number(selectedDay)
        )
    }

    const handleYear = event => {
        setSelectedYear(event.target.value)
    }

    const handleMonth = event => {
        const searchedMonth = findYear().months.find(
            (item, index) => index + 1 === Number(event.target.value)
        )
        if (Number(selectedDay) > searchedMonth.length) {
            setSelectedDay(String(searchedMonth.length))
            setSelectedMonth(event.target.value)
        }
        setSelectedMonth(event.target.value)
    }

    const handleDay = event => {
        setSelectedDay(event.target.value)
    }

    const handleClient = e => {
        setSelectedClient(e.target.value)
    }

    const handleChange = useCallback(
        e => {
            const editedClientsBalance = currentBalanceDay.clients.map(
                client => {
                    if (client.id === selectedClient) {
                        return e.target.type === 'textarea'
                            ? { ...client, [e.target.name]: e.target.value }
                            : {
                                  ...client,
                                  [e.target.name]: Number(e.target.value),
                              }
                    } else {
                        return client
                    }
                }
            )

            setCurrentBalanceDay({
                ...currentBalanceDay,
                clients: editedClientsBalance,
            })
        },
        [selectedClient, currentBalanceDay]
    )

    function findClientById(id) {
        if (id) {
            return currentBalanceDay.clients.find(item => item.id === id)
        } else {
            return currentBalanceDay.clients.find(
                item => item.id === selectedClient
            )
        }
    }

    function onSavePressed() {
        balanceDaySubmit(currentBalanceDay)
    }
    return {
        handleOpen,
        open,
        handleClose,
        selectedYear,
        handleYear,
        selectedMonth,
        handleMonth,
        findYear,
        selectedDay,
        handleDay,
        findMonth,
        selectedClient,
        handleClient,
        handleChange,
        findClientById,
        onSavePressed,
        currentBalanceDay,
    }
}

export const useSingleTranslator = (
    statistics,
    selectedDate,
    personalPenalties
) => {
    const [lastVirtualGiftDate, setLastVirtualGiftDate] = useState(null)
    const [chatsBonus, setChatsBonus] = useState(0)
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
        const monthStatistics = yearStatistics.months.find(
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
        return findYear().months.find(
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

    const getBonusesForChats = (
        id,
        date = selectedDate,
        category = 'chats'
    ) => {
        const data = {
            id,
            year: date.format('YYYY'),
            month: date.format('M'),
            category,
        }
        requestBonusesForChats(data).then(
            res => setChatsBonus(res.data[0]?.bonusChatsSum || 0) // can happen that translator is new and didn't exist in searched month
        ) // see no reasons to use try catch block here as it is used on server side already
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
        chatsBonus,
        getBonusesForChats,
    }
}
