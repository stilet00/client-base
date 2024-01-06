import { useState, useEffect, useCallback, useDeferredValue } from 'react'
import { useSelector } from 'react-redux'
import {
    getClients,
    addClient,
    updateClient,
} from '../../services/clientsServices/services'
import { getPaymentsRequest } from '../../services/financesStatement/services'
import Typography from '@mui/material/Typography'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import SingleClient from './SingleClient'
import ClientsChartsContainer from './ClientsCharts/ClientsChartContainer'
import Grid from '@mui/material/Grid'
import '../../styles/modules/ListOfClients.css'
import ClientsForm from './ClientsForm/ClientsForm'
import { useClientsList } from './businessLogic'
import {
    calculatePercentDifference,
    getSumFromArray,
} from '../../sharedFunctions/sharedFunctions'
import moment from 'moment'
import LoggedOutPage from '../AuthorizationPage/LoggedOutPage/LoggedOutPage'
import useModal from '../../sharedHooks/useModal'
import Button from '@mui/material/Button'
import { faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from '../../sharedComponents/Loader/Loader'
import { getClientsRating } from '../../sharedFunctions/sharedFunctions'
import { useAdminStatus } from '../../sharedHooks/useAdminStatus'
import MESSAGE from 'constants/messages'
import useSearch from 'sharedHooks/useSearchString'
import useDebounce from 'sharedHooks/useDebounce'

export default function ListOfClients() {
    const user = useSelector(state => state.auth.user)
    const [paymentsList, setPaymentsList] = useState([])
    const [showGraph, setShowGraph] = useState(false)
    const [clients, setClients] = useState([])
    const [graphData, setGraphData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [translators, setTranslators] = useState([])
    const [updatingClient, setUpdatingClient] = useState({})
    const { handleClose, handleOpen, open } = useModal()
    const { queryString, changeSearchParams } = useSearch()
    const [alertInfo, setAlertInfo] = useState({
        mainTitle: 'no message had been put',
        status: true,
    })
    const { alertOpen, closeAlert, openAlert } = useAlert()
    const {
        clientMonthSum,
        sortBySum,
        calculateMiddleMonthSum,
        getAllAsignedTranslators,
        getArrayOfBalancePerDay,
        getTotalProfitPerClient,
        currentYear,
    } = useClientsList(translators)
    const { isAdmin } = useAdminStatus(user)

    useEffect(() => {
        if (user) {
            ;(async () => {
                const responseDataWithClients = await getClients({})
                if (responseDataWithClients.status === 200) {
                    setClients(responseDataWithClients.data)
                } else {
                    setAlertInfo({
                        ...alertInfo,
                        mainTitle: MESSAGE.somethingWrongWithGettingClients,
                        status: false,
                    })
                    openAlert(5000)
                }
                setLoading(false)
            })()
            getPaymentsRequest({})
                .then(res => {
                    if (res.status === 200) {
                        setPaymentsList(res.data)
                    }
                })
                .catch(err => {
                    const message = err.message
                    setLoading(false)
                    setAlertInfo({
                        ...alertInfo,
                        mainTitle: message,
                        status: false,
                    })
                    openAlert(5000)
                })
        }
    }, [user])

    useDebounce(
        async () => {
            setLoading(true)
            const responseDataWithClients = await getClients({
                searchQuery: queryString,
            })
            if (responseDataWithClients.status === 200) {
                setClients(responseDataWithClients.data)
            } else {
                setAlertInfo({
                    ...alertInfo,
                    mainTitle: MESSAGE.somethingWrongWithGettingClients,
                    status: false,
                })
                openAlert(5000)
            }
            setLoading(false)
        },
        1000,
        [queryString]
    )

    const getUpdatingClient = _id => {
        const clientWithID = clients.find(client => client._id === _id)
        const clientWithFieldsForForm = {
            _id: clientWithID._id,
            name: clientWithID.name,
            surname: clientWithID.surname,
            bankAccount: clientWithID.bankAccount || 'PayPal',
            svadba: {
                login: clientWithID.svadba?.login || '',
                password: clientWithID.svadba?.password || '',
            },
            dating: {
                login: clientWithID.dating?.login || '',
                password: clientWithID.dating?.password || '',
            },
            instagramLink: clientWithID.instagramLink || '',
            image: clientWithID.image || '',
            suspended: !!clientWithID.suspended,
        }
        setUpdatingClient(clientWithFieldsForForm)
        handleOpen()
    }

    const clearEditedClient = () => {
        setUpdatingClient({})
    }

    const editClientData = useCallback(
        editedClient => {
            updateClient(editedClient)
                .then(res => {
                    if (res.status === 200) {
                        const message = 'Client had been successfully updated'
                        setAlertInfo({
                            ...alertInfo,
                            mainTitle: message,
                            status: true,
                        })
                        setClients(
                            clients.map(item => {
                                return item._id === editedClient._id
                                    ? editedClient
                                    : item
                            })
                        )
                        openAlert(2000)
                    } else {
                        throw new Error(`Error: ${res?.status}`)
                    }
                })
                .catch(err => {
                    const message =
                        err?.response?.data?.error || 'An error occurred'
                    setAlertInfo({
                        ...alertInfo,
                        mainTitle: message,
                        status: false,
                    })
                    openAlert()
                })
        },
        [clients, alertInfo, openAlert]
    )

    const addNewClient = async newClient => {
        try {
            const responseFromAddedClient = await addClient(newClient)
            if (responseFromAddedClient.status === 200) {
                setClients([
                    ...clients,
                    { ...newClient, _id: responseFromAddedClient.data },
                ])
                setAlertInfo({
                    ...alertInfo,
                    mainTitle: 'client had been added',
                    status: true,
                })
                openAlert(2000)
            } else {
                setAlertInfo({
                    ...alertInfo,
                    mainTitle: MESSAGE.somethingWrongWithAddingClient.text,
                    status: false,
                })
                openAlert(5000)
            }
        } catch (error) {
            setAlertInfo({
                ...alertInfo,
                mainTitle: MESSAGE.somethingWrongWithAddingClient.text,
                status: false,
            })
            openAlert(5000)
        }
    }
    const getSortedClients = clients => {
        if (clients.length === 0) {
            return []
        }
        const sortedClientsWithCalculations = clients
            .sort(sortBySum)
            .map(client => {
                const memorizedMiddleMonthSum = calculateMiddleMonthSum(
                    client._id
                )
                const memorizedPreviousMiddleMonthSum = calculateMiddleMonthSum(
                    client._id,
                    moment().subtract(1, 'month')
                )
                const memorizedMonthSum = clientMonthSum(client._id)
                const memorizedPreviousMonthSum = clientMonthSum(
                    client._id,
                    moment().subtract(1, 'month')
                )
                const arrayOfPaymentsMadeToClient = paymentsList.filter(
                    payment =>
                        payment.receiverID === client._id &&
                        payment.date.substring(6, 10) === currentYear
                )
                const getArrayOfPaymentsMadeToClientWithAmounts =
                    arrayOfPaymentsMadeToClient.map(payment => payment.amount)
                const spendsOnClient = getSumFromArray(
                    getArrayOfPaymentsMadeToClientWithAmounts
                )

                const clientProfit = getTotalProfitPerClient(client._id)
                const clientWithPersonalAndFinancialData = {
                    _id: client._id,
                    name: client.name,
                    surname: client.surname,
                    currentMonthTotalAmount: memorizedMonthSum,
                    translators: getAllAsignedTranslators(client._id),
                    rating: getClientsRating(memorizedMiddleMonthSum),
                    bankAccount: client.bankAccount || 'PayPal',
                    svadba: {
                        login: client.svadba?.login || '',
                        password: client.svadba?.password || '',
                    },
                    dating: {
                        login: client.dating?.login || '',
                        password: client.dating?.password || '',
                    },
                    instagramLink:
                        'https://www.instagram.com/' + client.instagramLink ||
                        'https://www.instagram.com/',
                    loss: spendsOnClient,
                    image: client.image ?? null,
                    suspended: !!client.suspended,
                    currentYearProfit: clientProfit.currentYearProfit,
                    absoluteProfit: clientProfit.allYearsProfit,
                    previousMonthTotalAmount: memorizedPreviousMonthSum,
                    middleMonthSum: memorizedMiddleMonthSum,
                    prevousMiddleMonthSum: memorizedPreviousMiddleMonthSum,
                    monthProgressPercent: calculatePercentDifference(
                        memorizedMiddleMonthSum,
                        memorizedPreviousMiddleMonthSum
                    ),
                }
                return clientWithPersonalAndFinancialData
            })
        return sortedClientsWithCalculations
    }

    const getFilteredClients = client =>
        `${client.name} ${client.surname}`.toLowerCase()

    const closeGraph = () => {
        setShowGraph(false)
    }

    const switchToGraph = argsFromHandleSwitchToGraph => {
        const { id, category } = argsFromHandleSwitchToGraph
        const pickedClientSumsPerMonth = getArrayOfBalancePerDay(id, category)
        setGraphData(pickedClientSumsPerMonth)
        setShowGraph(true)
    }

    if (!user) {
        return <LoggedOutPage />
    }

    return (
        <>
            <div>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search for..."
                    value={queryString}
                    onChange={e => {
                        changeSearchParams(e.target.value)
                    }}
                ></input>
            </div>
            <div className={'main-container scrolled-container animated-box'}>
                {loading && <Loader />}
                {!loading && (
                    <>
                        <ClientsChartsContainer
                            user={user}
                            values={graphData}
                            open={showGraph}
                            handleClose={closeGraph}
                        />
                        {clients?.length > 0 && (
                            <Grid
                                container
                                spacing={2}
                                id="on-scroll__rotate-animation-list"
                            >
                                {getSortedClients(clients)
                                    .filter(getFilteredClients)
                                    .map(client => (
                                        <Grid
                                            key={client._id}
                                            item
                                            xs={12}
                                            md={4}
                                            sm={6}
                                        >
                                            <SingleClient
                                                key={client._id}
                                                {...client}
                                                admin={isAdmin}
                                                handleUpdatingClientsId={
                                                    getUpdatingClient
                                                }
                                                handleSwitchToGraph={
                                                    switchToGraph
                                                }
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        )}
                        {!clients?.length && (
                            <Typography
                                variant="h5"
                                component="div"
                                style={{ margin: 'auto' }}
                            >{`No clients found`}</Typography>
                        )}
                    </>
                )}
            </div>
            <div className="socials button-add-container">
                <Button
                    type="button"
                    onClick={handleOpen}
                    fullWidth
                    startIcon={<FontAwesomeIcon icon={faVenus} />}
                    disabled={!isAdmin}
                >
                    Add client
                </Button>
                {isAdmin && (
                    <ClientsForm
                        editedClient={updatingClient}
                        onAddNewClient={addNewClient}
                        onEditClientData={editClientData}
                        handleClose={handleClose}
                        clearEditedClient={clearEditedClient}
                        open={open}
                    />
                )}
            </div>
            <AlertMessage
                mainText={alertInfo.mainTitle}
                open={alertOpen}
                handleOpen={openAlert}
                handleClose={closeAlert}
                status={alertInfo.status}
            />
        </>
    )
}
