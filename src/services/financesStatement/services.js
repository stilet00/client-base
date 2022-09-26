import axios from 'axios'
import { rootURL } from '../rootURL'

const financeStatementsURL = rootURL + 'statements/'

export function getPaymentsRequest() {
    return axios.get(financeStatementsURL + 'get/')
}

export function addPaymentRequest(payment) {
    return axios.post(financeStatementsURL + 'add/', payment)
}

export function removePaymentRequest(id) {
    return axios.delete(financeStatementsURL + id)
}
