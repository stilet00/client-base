import { useCallback, useEffect, useState } from 'react'
import { MESSAGES } from '../../constants/messages'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import {
    addTranslator,
    getTranslators,
    removeTranslator,
    updateTranslator,
} from '../../services/translatorsServices/services'
import {
    currentMonth,
    currentYear,
    DEFAULT_DAY_CLIENT,
    previousDay,
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
} from '../../sharedFunctions/sharedFunctions'

export const useTranslators = user => {
    const [globalState, setGlobalState] = useState({
        message: MESSAGES.addTranslator,
        clients: [],
        translators: [],
        currentClient: [null],
        loading: true,
        deletedTranslator: null,
        translatorFilter: {
            suspended: true,
            date: moment().subtract(1, 'month'),
        },
        state: {
            left: false,
        },
    })

    const { alertOpen, closeAlert, openAlert } = useAlert()

    const {
        alertStatusConfirmation,
        openAlertConfirmation,
        closeAlertConfirmationNoReload,
    } = useAlertConfirmation()

    useEffect(() => {
        if (user) {
            async function fetchData() {
                let newState = globalState
                await getTranslators().then(res => {
                    if (res.status === 200) {
                        newState = {
                            ...newState,
                            loading: false,
                            translators: res.data,
                        }
                    } else {
                        console.log('No translators')
                    }
                })

                await getClients().then(res => {
                    if (res.status === 200) {
                        newState = { ...newState, clients: res.data }
                    } else {
                        console.log('No clients')
                    }
                })
                return newState
            }
            fetchData().then(data => setGlobalState(data))
        }
    }, [user])

    const changeFilter = useCallback(
        e => {
            if (e.target) {
                const newFilter = {
                    ...globalState.translatorFilter,
                    [e.target.name]:
                        !globalState.translatorFilter[e.target.name],
                }
                setGlobalState({ ...globalState, translatorFilter: newFilter })
            } else {
                setGlobalState({
                    ...globalState,
                    translatorFilter: {
                        ...globalState.translatorFilter,
                        date: e,
                    },
                })
            }
        },
        [globalState]
    )

    const filterTranslators = useCallback(() => {
        if (globalState.translatorFilter.suspended) {
            return globalState.translators.filter(
                translator =>
                    translator.suspended.status !==
                    globalState.translatorFilter.suspended
            )
        } else {
            return globalState.translators
        }
    }, [globalState])

    const showAlertMessage = useCallback(
        alertMessage => {
            setGlobalState({ ...globalState, message: alertMessage })
            openAlert()
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
            setGlobalState({
                ...globalState,
                state: { ...globalState.state, [anchor]: open },
            })
        },
        [globalState]
    )

    const dragStartHandler = useCallback((e, client) => {
        setGlobalState({ ...globalState, currentClient: client })
        e.target.style.border = '2px solid black'
    }, [])

    const dragLeaveHandler = useCallback(
        e => {
            if (globalState.state.left === true) {
                setGlobalState({ ...globalState, state: { left: false } })
            }
            if (e.target.tagName === 'UL') {
                e.target.style.background = 'none'
            } else if (e.target.tagName === 'LI') {
                e.target.parentNode.style.background = 'none'
            }
        },
        [globalState]
    )

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
                    setGlobalState({
                        ...globalState,
                        translators: globalState.translators.map(item => {
                            return item._id === editedTranslator._id
                                ? editedTranslator
                                : item
                        }),
                    })
                } else {
                    showAlertMessage(MESSAGES.somethingWrong)
                    console.log(res.data)
                }
            })
        },
        [globalState, showAlertMessage]
    )

    const onBoardDrop = useCallback(
        (e, translatorID) => {
            e.preventDefault()
            if (e.target.tagName === 'UL') {
                e.target.style.background = 'none'
            } else if (e.target.tagName === 'LI') {
                e.target.parentNode.style.background = 'none'
            }

            let editedTranslator = globalState.translators.find(
                item => item._id === translatorID
            )

            if (
                editedTranslator.clients.filter(
                    item => item._id === globalState.currentClient._id
                ).length > 0
            ) {
                showAlertMessage(MESSAGES.clientExist)
            } else {
                editedTranslator = insertClient(
                    editedTranslator,
                    globalState.currentClient
                )
                saveChangedTranslator(
                    editedTranslator,
                    MESSAGES.translatorFilled
                )
            }
        },
        [globalState, showAlertMessage, showAlertMessage]
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
                    setGlobalState({
                        ...globalState,
                        clients: globalState.clients.filter(
                            item => item._id !== id
                        ),
                    })
                } else {
                    showAlertMessage(MESSAGES.somethingWrong)
                    console.log(res.data)
                }
            })
        },
        [globalState, showAlertMessage]
    )

    const startTranslatorDelete = useCallback(
        id => {
            const translator = globalState.translators.find(
                item => item._id === id
            )
            setGlobalState({
                ...globalState,
                deletedTranslator: translator,
                message: {
                    text: `You are deleting ${translator.name} ${translator.surname}`,
                    status: false,
                },
            })

            openAlertConfirmation()
        },
        [globalState, openAlertConfirmation]
    )

    const finishTranslatorDelete = useCallback(() => {
        removeTranslator(globalState.deletedTranslator._id).then(res => {
            if (res.status === 200) {
                closeAlertConfirmationNoReload()
                setGlobalState({
                    ...globalState,
                    translators: globalState.translators.filter(
                        item => item._id !== globalState.deletedTranslator._id
                    ),
                    message: MESSAGES.addTranslator,
                })
            } else {
                showAlertMessage(MESSAGES.somethingWrong)
                console.log(res.data)
            }
        })
    }, [globalState, showAlertMessage, closeAlertConfirmationNoReload])

    const translatorsFormSubmit = useCallback(
        (e, newTranslator) => {
            e.preventDefault()
            if (
                globalState.translators.filter(existingTranslator => {
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
                        setGlobalState({
                            ...globalState,
                            translators: [
                                ...globalState.translators,
                                { ...newTranslator, _id: res.data },
                            ],
                        })
                    } else {
                        console.log(res.status)
                    }
                })
            }
        },
        [globalState, showAlertMessage]
    )

    const clientsFormSubmit = useCallback(
        (e, newClient) => {
            e.preventDefault()

            addClient(newClient).then(res => {
                if (res.status === 200) {
                    showAlertMessage(MESSAGES.addClient)
                    setGlobalState({
                        ...globalState,
                        clients: [
                            ...globalState.clients,
                            { ...newClient, _id: res.data },
                        ],
                    })
                } else {
                    showAlertMessage(MESSAGES.somethingWrong)
                    console.log(res.data)
                }
            })
        },
        [globalState, showAlertMessage]
    )

    const balanceDaySubmit = useCallback(
        (translatorId, balanceDay) => {
            let editedTranslator = globalState.translators.find(
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
        [globalState]
    )

    const calculateMonthTotal = useCallback(() => {
        let sum = 0
        globalState.translators.forEach(translator => {
            let translatorsStatistic = translator.statistics
            sum =
                sum +
                Number(calculateTranslatorMonthTotal(translatorsStatistic))
        })
        return Math.round(sum)
    }, [globalState])

    const suspendTranslator = useCallback(
        translatorId => {
            let editedTranslator = globalState.translators.find(
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
        [globalState]
    )

    const suspendClient = useCallback(
        (translatorId, clientId) => {
            const editedTranslator = globalState.translators.find(
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
        [globalState]
    )

    return {
        translators: globalState.translators,
        loading: globalState.loading,
        clients: globalState.clients,
        message: globalState.message,
        translatorFilter: globalState.translatorFilter,
        state: globalState.state,
        startTranslatorDelete,
        dragOverHandler,
        onBoardDrop,
        dragLeaveHandler,
        toggleDrawer,
        dragEndHandler,
        dragStartHandler,
        dragDropHandler,
        deleteClient,
        clientsFormSubmit,
        translatorsFormSubmit,
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
    }
}

export const useBalanceForm = ({ balanceDaySubmit, statistics, clients }) => {
    const { open, handleOpen, handleClose } = useModal()

    const [selectedClient, setSelectedClient] = useState(clients[0]._id)

    const [selectedYear, setSelectedYear] = useState(currentYear)

    const [selectedMonth, setSelectedMonth] = useState(currentMonth)

    const [selectedDay, setSelectedDay] = useState(previousDay)

    useEffect(() => {
        setCurrentBalanceDay(findTodayBalance())
    }, [selectedYear, selectedMonth, selectedDay, statistics])

    const findYear = useCallback(() => {
        return statistics.find(item => item.year === selectedYear)
    }, [statistics, selectedYear])

    const findMonth = useCallback(() => {
        return findYear().months.find(
            (item, index) => index + 1 === Number(selectedMonth)
        )
    }, [findYear, selectedMonth])

    const findTodayBalance = useCallback(() => {
        return findMonth().find(
            (item, index) => index + 1 === Number(selectedDay)
        )
    }, [findMonth, selectedDay])

    const [currentBalanceDay, setCurrentBalanceDay] = useState(
        findTodayBalance()
    )

    const handleYear = event => {
        setSelectedYear(event.target.value)
    }

    const handleMonth = useCallback(event => {
        setSelectedMonth(event.target.value)
    }, [])

    const handleDay = useCallback(event => {
        setSelectedDay(event.target.value)
    }, [])

    const handleClient = useCallback(e => {
        setSelectedClient(e.target.value)
    }, [])

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

    const findClientById = useCallback(
        id => {
            if (id) {
                return currentBalanceDay.clients.find(item => item.id === id)
            } else {
                return currentBalanceDay.clients.find(
                    item => item.id === selectedClient
                )
            }
        },
        [currentBalanceDay, selectedClient]
    )

    const onSavePressed = useCallback(() => {
        balanceDaySubmit(currentBalanceDay)
    }, [])

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

export const useSingleTranslator = (statistics, selectedDate) => {
    const calculateTranslatorYesterdayTotal = statistics => {
        const day = statistics
            .find(
                year => year.year === moment().subtract(1, 'day').format('YYYY')
            )
            .months.find(
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

    const calculateTranslatorDayTotal = statistics => {
        const day = statistics
            .find(year => year.year === selectedDate.format('YYYY'))
            .months.find(
                (month, index) => index + 1 === Number(selectedDate.format('M'))
            )
            .find(day => {
                return day.id === selectedDate.format('DD MM YYYY')
            })
        return calculateBalanceDayAllClients(day)
    }

    function findYear(yearFilter = currentYear) {
        return statistics.find(item => item.year === yearFilter)
    }

    function findMonth(monthFilter = currentMonth) {
        return findYear().months.find(
            (item, index) => index + 1 === Number(monthFilter)
        )
    }

    function findYesterdayBalance() {
        return findMonth().find(
            (item, index) => index + 1 === Number(previousDay)
        )
    }

    function calculateSumByClient(clientId) {
        const clientObject = findYesterdayBalance().clients.find(
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
        const clientObject = findYesterdayBalance().clients.find(
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

    return {
        calculateSumByClient,
        specialColorNeeded,
        getTranslatorsRating,
        calculateMiddleMonthSum,
        calculateTranslatorYesterdayTotal,
        calculateTranslatorDayTotal,
    }
}
