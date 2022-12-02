import axios from 'axios'
import { rootURL } from '../rootURL'
const translatorsURL = rootURL + 'translators/'
const currencyLink =
    'https://api.currencyapi.com/v3/latest?apikey=KmA41cfqr82rJ9izxT07gnVXImqmTC9cE86a4x06'

export function getTranslators() {
    return axios.get(translatorsURL + 'get/')
}
export function addTranslator(translator) {
    return axios.post(translatorsURL + 'add/', translator)
}
export function removeTranslator(id) {
    return axios.delete(translatorsURL + id)
}
export function updateTranslator(translator) {
    return axios.put(translatorsURL + translator._id, translator)
}

export function sendNotificationEmailsRequest() {
    return axios.get(translatorsURL + 'send-emails')
}
export function getCurrency() {
    return axios.get(currencyLink, {
        headers: { 'Access-Control-Allow-Origin': 'origin-list' },
        responseType: 'json',
    })
}
