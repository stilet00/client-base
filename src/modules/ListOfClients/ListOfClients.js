import { useState, useEffect } from 'react'
import { getClients } from '../../services/clientsServices/services'
import SingleClient from './SingleClient'
import Grid from '@mui/material/Grid'
import '../../styles/modules/ListOfClients.css'

export default function ListOfClients() {
    const [clients, setClients] = useState([])
    useEffect(() => {
        getClients().then(res => {
            if (res.status === 200) {
                setClients(res.data)
            }
        })
    }, [])

    const getClientsWithData = clients => {
        const editedClientsWithData = clients.map(client => {
            const editedClient = {
                id: client.id,
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
    getClientsWithData(clients)
    return (
        <div className={'main-container scrolled-container  animated-box'}>
            <Grid container spacing={2}>
                {getClientsWithData(clients).map(client => (
                    <Grid key={client.id} item xs={12} md={4} sm={6}>
                        <SingleClient key={client.id} {...client} />
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
