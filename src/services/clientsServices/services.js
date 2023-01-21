import axios from 'axios'
import { rootURL } from '../rootURL'

const clientsURL = rootURL + 'clients/'

export function getClients() {
    return axios.get(clientsURL + 'get/')
}

export function addClient(client) {
    return axios.post(clientsURL + 'add/', client)
}

export function removeClient(id) {
    return axios.delete(clientsURL + id)
}

export function updateClient(editedClient) {
    return axios.put(clientsURL + editedClient._id, editedClient)
}
