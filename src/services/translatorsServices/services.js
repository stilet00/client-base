import axios from 'axios'
import { rootURL } from '../rootURL'
import { getConfigForAxiosAuthenticatedRequest } from '../utils'

const translatorsURL = rootURL + 'translators/'
const balanceDayURL = rootURL + 'balance-day/'
const personalPenaltyURL = rootURL + 'personal-penalty/'

export function getTranslators({ searchQuery = '', shouldGetClients = false }) {
    let queryParams = ''
    if (searchQuery) {
        queryParams +=
            (queryParams ? '&' : '?') +
            `searchQuery=${encodeURIComponent(searchQuery)}`
    }
    if (shouldGetClients) {
        queryParams += (queryParams ? '&' : '?') + 'shouldGetClients=true'
    }
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

export function assignClientToTranslatorRequest({ clientId, translatorId }) {
    return axios.put(
        translatorsURL + 'assign-client',
        {
            clientId,
            translatorId,
        },
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

export function getBonusesForChatsRequest(data) {
    console.log(translatorsURL + 'chat-bonus')
    return axios.post(
        translatorsURL + 'chat-bonus',
        data,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function getBalanceDay({ translatorId, clientId, dateTimeId }) {
    return axios.get(
        balanceDayURL +
            `?translatorId=${translatorId}&clientId=${clientId}&dateTimeId=${dateTimeId}`,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function createBalanceDay({ newBalanceDay }) {
    return axios.post(
        balanceDayURL + `create`,
        {
            ...newBalanceDay,
        },
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function updateBalanceDay({ balanceDayToSubmit }) {
    return axios.put(
        balanceDayURL + `update`,
        {
            ...balanceDayToSubmit,
        },
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function getBalanceDaysForTranslatorRequest({
    dateTimeFilter = '',
    translatorId = '',
}) {
    return axios.get(
        `${balanceDayURL}translators?dateTimeFilter=${dateTimeFilter}&translatorId=${translatorId}`,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export async function createPersonalPenalty({ personalPenaltyData }) {
    return axios.post(
        `${personalPenaltyURL}create`,
        personalPenaltyData,
        getConfigForAxiosAuthenticatedRequest()
    )
}
