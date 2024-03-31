import axios from 'axios'
import { rootURL } from '../rootURL'
import { getConfigForAxiosAuthenticatedRequest } from '../utils'

const translatorsURL = rootURL + 'translators/'

export function getTranslators(statisticsYear = null) {
    const queryParams = statisticsYear
        ? `?params=${encodeURIComponent(statisticsYear)}`
        : ''
    return axios.get(
        translatorsURL + 'get/' + queryParams,
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

export function sendLastVirtualGiftDateRequest(id) {
    return axios.get(
        translatorsURL + 'last-gift/' + id,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function requestBonusesForChats(data) {
    return axios.post(
        translatorsURL + 'chat-bonus',
        data,
        getConfigForAxiosAuthenticatedRequest()
    )
}
