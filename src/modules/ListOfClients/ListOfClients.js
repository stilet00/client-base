import { useState, useEffect, useCallback } from 'react'
import {
    getClients,
    addClient,
    updateClient,
} from '../../services/clientsServices/services'
import { getTranslators } from '../../services/translatorsServices/services'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import SingleClient from './SingleClient'
import ClientsChartsContainer from './ClientsCharts/ClientsChartContainer'
import Grid from '@mui/material/Grid'
import '../../styles/modules/ListOfClients.css'
import ClientsForm from './ClientsForm/ClientsForm'
import { useClientsList } from './businessLogic'
import { calculatePercentDifference } from '../../sharedFunctions/sharedFunctions'
import moment from 'moment'
import Unauthorized from '../AuthorizationPage/Unauthorized/Unauthorized'
import useModal from '../../sharedHooks/useModal'
import Button from '@material-ui/core/Button'
import { faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from '../../sharedComponents/Loader/Loader'

export default function ListOfClients({ user }) {
    const [showGraph, setShowGraph] = useState(false)
    const [clients, setClients] = useState([])
    const [graphData, setGraphData] = useState([])
    const [loading, setLoading] = useState(true)
    const [translators, setTranslators] = useState([])
    const [updatingClient, setUpdatingClient] = useState({})
    const [search, setSearch] = useState('')
    const { handleClose, handleOpen, open } = useModal()
    const [alertInfo, setAlertInfo] = useState({
        mainTitle: 'no message had been put',
        status: true,
    })
    const { alertOpen, closeAlert, openAlert } = useAlert()
    const {
        clientMonthSum,
        sortBySum,
        getClientsRating,
        calculateMiddleMonthSum,
        getAllAsignedTranslators,
        getArrayOfBalancePerDay,
    } = useClientsList(translators)

    useEffect(() => {
        if (user) {
            getTranslators()
                .then(res => {
                    if (res.status === 200) {
                        setLoading(false)
                        setTranslators(res.data)
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

            getClients()
                .then(res => {
                    if (res.status === 200) {
                        setClients(res.data)
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
                        console.log(res.data)
                    }
                })
                .catch(err => {
                    const message = err.message
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

    const addNewClient = useCallback(
        newClient => {
            const message = 'clients date had been added'
            setAlertInfo({
                ...alertInfo,
                mainTitle: message,
                status: true,
            })
            openAlert(2000)
            addClient(newClient)
                .then(res => {
                    if (res.status === 200) {
                        setClients([
                            ...clients,
                            { ...newClient, _id: res.data },
                        ])
                        setAlertInfo({
                            ...alertInfo,
                            mainTitle: 'client had been added',
                            status: true,
                        })
                        openAlert(2000)
                    }
                })
                .catch(err => {
                    const message = err.message
                    setAlertInfo({
                        ...alertInfo,
                        mainTitle: message,
                        status: false,
                    })
                    openAlert(5000)
                })
        },
        [clients, alertInfo, openAlert]
    )

    const getSortedClientsWithCalculations = useCallback(
        clients => {
            const sortedClientsWithCalculations = clients
                .sort(sortBySum)
                .map(client => {
                    const memorizedMiddleMonthSum = calculateMiddleMonthSum(
                        client._id
                    )
                    const memorizedPreviousMiddleMonthSum =
                        calculateMiddleMonthSum(
                            client._id,
                            moment().subtract(1, 'month')
                        )
                    const memorizedMonthSum = clientMonthSum(client._id)
                    const memorizedPreviousMonthSum = clientMonthSum(
                        client._id,
                        moment().subtract(1, 'month')
                    )
                    const clientWithCalculations = {
                        _id: client._id,
                        name: client.name,
                        surname: client.surname,
                        currentMonthTotalAmount: memorizedMonthSum,
                        translators: getAllAsignedTranslators(client._id),
                        rating: getClientsRating(client._id),
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
                            'https://www.instagram.com/' +
                                client.instagramLink ||
                            'https://www.instagram.com/',
                        previousMonthTotalAmount: memorizedPreviousMonthSum,
                        middleMonthSum: memorizedMiddleMonthSum,
                        prevousMiddleMonthSum: memorizedPreviousMiddleMonthSum,
                        monthProgressPercent: calculatePercentDifference(
                            memorizedMiddleMonthSum,
                            memorizedPreviousMiddleMonthSum
                        ),
                    }
                    return clientWithCalculations
                })
            return sortedClientsWithCalculations.filter(client =>
                `${client.name} ${client.surname}`
                    .toLowerCase()
                    .includes(search)
            )
        },
        [
            clients,
            search,
            calculateMiddleMonthSum(),
            clientMonthSum(),
            getAllAsignedTranslators(),
            getClientsRating(),
        ]
    )

    const closeGraph = () => {
        setShowGraph(false)
    }

    const switchToGraph = id => {
        const pickedClientSumsPerMonth = getArrayOfBalancePerDay(id)
        setGraphData(pickedClientSumsPerMonth)
        setShowGraph(true)
    }

    function onSearchChange(e) {
        setSearch(e.target.value.toLowerCase())
    }

    return user && !loading ? (
        <>
            <div>
                <input
                    className="top-menu-button"
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={onSearchChange}
                ></input>
            </div>
            <div className={'main-container scrolled-container  animated-box'}>
                <ClientsChartsContainer
                    user={user}
                    values={graphData}
                    open={showGraph}
                    handleClose={closeGraph}
                />

                <Grid container spacing={2}>
                    {getSortedClientsWithCalculations(clients).map(client => (
                        <Grid key={client._id} item xs={12} md={4} sm={6}>
                            <SingleClient
                                key={client._id}
                                {...client}
                                handleUpdatingClientsId={getUpdatingClient}
                                handleSwitchToGraph={switchToGraph}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div className="socials button-add-container bottom-button">
                <Button
                    type="button"
                    onClick={handleOpen}
                    fullWidth
                    startIcon={<FontAwesomeIcon icon={faVenus} />}
                >
                    Add client
                </Button>
                <ClientsForm
                    editedClient={updatingClient}
                    onAddNewClient={addNewClient}
                    onEditClientData={editClientData}
                    handleClose={handleClose}
                    clearEditedClient={clearEditedClient}
                    open={open}
                />
            </div>
            <AlertMessage
                mainText={alertInfo.mainTitle}
                open={alertOpen}
                handleOpen={openAlert}
                handleClose={closeAlert}
                status={alertInfo.status}
            />
        </>
    ) : user && loading ? (
        <div className={'main-container scrolled-container  animated-box'}>
            <Loader />
        </div>
    ) : (
        <Unauthorized />
    )
}
