import axios from 'axios'
import { rootURL } from '../rootURL'
import { getConfigForAxiosAuthenticatedRequest } from '../utils'
import {
    BalanceDay,
    PersonalPenalty,
    Translator,
} from '../../api/models/translatorsDatabaseModels'

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

export function addTranslator(translator: Translator) {
    return axios.post(
        translatorsURL + 'add/',
        translator,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function removeTranslator(id: string) {
    return axios.delete(
        translatorsURL + id,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function updateTranslator(translator: Translator) {
    return axios.put(
        translatorsURL + translator._id,
        translator,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function assignClientToTranslatorRequest({
    clientId,
    translatorId,
}: {
    clientId: string
    translatorId: string
}) {
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

export function sendLastVirtualGiftDateRequest(id: string) {
    return axios.get(
        translatorsURL + 'last-gift/' + id,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function getBalanceDay({
    translatorId,
    clientId,
    dateTimeId,
}: {
    translatorId: string
    clientId: string
    dateTimeId: string
}) {
    return axios.get(
        `${balanceDayURL}?translatorId=${translatorId}&clientId=${clientId}&dateTimeId=${encodeURIComponent(
            dateTimeId
        )}`,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function createBalanceDay({
    newBalanceDay,
}: {
    newBalanceDay: BalanceDay
}) {
    return axios.post(
        balanceDayURL + `create`,
        {
            ...newBalanceDay,
        },
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function updateBalanceDay({
    balanceDayToSubmit,
}: {
    balanceDayToSubmit: BalanceDay
}) {
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

export function getPenaltiesForTranslatorRequest({
    dateTimeFilter = '',
    translatorId = '',
}) {
    return axios.get(
        `${personalPenaltyURL}get?dateTimeFilter=${dateTimeFilter}&translatorId=${translatorId}`,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export async function createPersonalPenalty({
    personalPenaltyData,
}: {
    personalPenaltyData: PersonalPenalty
}) {
    return axios.post(
        `${personalPenaltyURL}create`,
        personalPenaltyData,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export async function toggleClientSuspendedRequest({
    clientId,
    translatorId,
}: {
    clientId: string
    translatorId: string
}) {
    return axios.put(
        `${translatorsURL}suspend-client`,
        {
            clientId,
            translatorId,
        },
        getConfigForAxiosAuthenticatedRequest()
    )
}
