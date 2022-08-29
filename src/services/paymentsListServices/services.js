import axios from 'axios'
const paymentsListUrl = 'https://630a47433249910032839dbc.mockapi.io/Payments/'

export function getPayments() {
    return axios.get(paymentsListUrl)
}

export function addPayments(newPayment) {
    return axios.post(paymentsListUrl, newPayment)
}
