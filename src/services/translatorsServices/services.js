import axios from 'axios'
import { rootURL } from '../rootURL'
import { getConfigForAxiosAuthenticatedRequest } from '../utils'

const translatorsURL = rootURL + 'translators/'

export function getTranslators() {
    return axios.get(
        translatorsURL + 'get/',
        getConfigForAxiosAuthenticatedRequest()
    )
}
export function addTranslator(translator) {
    return axios.post(
        translatorsURL + 'add/',
        translator,
        getConfigForAxiosAuthenticatedRequest()
    )
}
export function removeTranslator(id) {
    return axios.delete(
        translatorsURL + id,
        getConfigForAxiosAuthenticatedRequest()
    )
}
export function updateTranslator(translator) {
    return axios.put(
        translatorsURL + translator._id,
        translator,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function sendNotificationEmailsRequest() {
    return axios.get(
        translatorsURL + 'send-emails',
        getConfigForAxiosAuthenticatedRequest()
    )
}
