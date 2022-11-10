import { useState, useEffect, useCallback } from 'react'
import { getClients, addClient } from '../../services/clientsServices/services'
import { getTranslators } from '../../services/translatorsServices/services'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import SingleClient from './SingleClient'
import Grid from '@mui/material/Grid'
import '../../styles/modules/ListOfClients.css'
import ClientsForm from './ClientsForm/ClientsForm'
import { useClientsList } from './businessLogic'
import { calculatePercentDifference } from '../../sharedFunctions/sharedFunctions'
import moment from 'moment'

export default function ListOfClients({ user }) {
    const [clients, setClients] = useState([])
    const [translators, setTranslators] = useState([])
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
    } = useClientsList(translators)

    useEffect(() => {
        if (user) {
            getTranslators().then(res => {
                if (res.status === 200) {
                    setTranslators(res.data)
                } else {
                    console.log('No translators')
                }
            })

            getClients().then(res => {
                if (res.status === 200) {
                    setClients(res.data)
                } else {
                    console.log('No clients')
                }
            })
        }
    }, [user])

    const handleClientsFormSubmit = useCallback(
        newClient => {
            setAlertInfo({
                ...alertInfo,
                mainTitle: 'client had been added',
                status: true,
            })
            openAlert(2000)
            addClient(newClient).then(res => {
                if (res.status === 200) {
                    setClients([...clients, { ...newClient, _id: res.data }])
                } else {
                    console.log(res.data)
                }
            })
        },
        [clients]
    )
    const getSortedClientsWithCalculations = clients => {
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

                const clientWithCalculations = {
                    id: client._id,
                    name: client.name,
                    surname: client.surname,
                    currentMonthTotalAmount: memorizedMonthSum,
                    translators: getAllAsignedTranslators(client._id),
                    rating: getClientsRating(client._id),
                    bank: client.bank || 'PayPal',
                    link:
                        'https://www.instagram.com/' + client.link ||
                        'https://www.instagram.com/erudaya/',
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
        return sortedClientsWithCalculations
    }

    return (
        <>
            <div className={'main-container scrolled-container  animated-box'}>
                <Grid container spacing={2}>
                    {getSortedClientsWithCalculations(clients).map(client => (
                        <Grid key={client.id} item xs={12} md={4} sm={6}>
                            <SingleClient key={client.id} {...client} />
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div className="socials button-add-container bottom-button">
                <ClientsForm
                    onClientsFormSubmit={handleClientsFormSubmit}
                    translators={translators}
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
    )
}
