import axios from 'axios'
import { rootURL } from '../rootURL'
import { getConfigForAxiosAuthenticatedRequest } from '../utils'

const financeStatementsURL = rootURL + 'statements/'

export function getPaymentsRequest() {
    return axios.get(
        financeStatementsURL + 'get/',
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function addPaymentRequest(payment) {
    return axios.post(
        financeStatementsURL + 'add/',
        payment,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function removePaymentRequest(id) {
    return axios.delete(
        financeStatementsURL + id,
        getConfigForAxiosAuthenticatedRequest()
    )
}
