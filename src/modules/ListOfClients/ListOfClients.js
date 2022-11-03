import { useState, useEffect } from 'react'
import { getClients } from '../../services/clientsServices/services'
import { getTranslators } from '../../services/translatorsServices/services'
import SingleClient from './SingleClient'
import Grid from '@mui/material/Grid'
import '../../styles/modules/ListOfClients.css'
import ClientsForm from './ClientsForm/ClientsForm'

export default function ListOfClients({ user }) {
    const [clients, setClients] = useState([])
    const [translators, setTranslators] = useState([])

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

    const getClientsWithData = clients => {
        const editedClientsWithData = clients.map(client => {
            const editedClient = {
                id: client._id,
                name: client.name,
                surname: client.surname,
                sumAmount: '1000',
                translators: ['Kislaya Antonina', 'Bavdis Mariana'],
                bank: '4149 4627 2099 4043',
                link: 'https://www.instagram.com/erudaya/',
            }
            return editedClient
        })
        return editedClientsWithData
    }

    return (
        <>
            <div className={'main-container scrolled-container  animated-box'}>
                <Grid container spacing={2}>
                    {getClientsWithData(clients).map(client => (
                        <Grid key={client.id} item xs={12} md={4} sm={6}>
                            <SingleClient key={client.id} {...client} />
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div className="socials button-add-container bottom-button">
                <ClientsForm translators={translators} />
            </div>
        </>
    )
}
