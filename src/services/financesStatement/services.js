import axios from 'axios'
import { rootURL } from '../rootURL'

const financeStatementsURL = rootURL + 'statements/'

export function getPayments() {
    return axios.get(financeStatementsURL + 'get/')
}

export function addPayment(payment) {
    return axios.post(financeStatementsURL + 'add/', payment)
}

export function removePayment(id) {
    return axios.delete(financeStatementsURL + id)
}
