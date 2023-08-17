import axios from 'axios'
import { rootURL } from '../rootURL'
import { getConfigForAxiosAuthenticatedRequest } from '../utils'

const clientsURL = rootURL + 'clients/'

export function getClients(params = null) {
    const queryParams = params ? `?params=${encodeURIComponent(params)}` : ''

    return axios.get(
        clientsURL + 'get/' + queryParams,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function addClient(client) {
    return axios.post(
        clientsURL + 'add/',
        client,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function removeClient(id) {
    return axios.delete(
        clientsURL + id,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function updateClient(editedClient) {
    return axios.put(
        clientsURL + editedClient._id,
        editedClient,
        getConfigForAxiosAuthenticatedRequest()
    )
}
