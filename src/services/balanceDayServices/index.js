import axios from 'axios'
import { rootURL } from '../rootURL'
import { getConfigForAxiosAuthenticatedRequest } from '../utils'

const balanceDayURL = rootURL + 'balance-day/'

export function getBalanceDaysForOverviewRequest({ yearFilter = '' }) {
    return axios.get(
        `${balanceDayURL}all?yearFilter=${yearFilter}`,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export const getBalanceTotalForCurrentMonthRequest = async () => {
    return axios.get(
        `${balanceDayURL}current-month-total`,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function getBalanceDaysForChartsRequest({ yearFilter = '' }) {
    return axios.get(
        `${balanceDayURL}all?yearFilter=${yearFilter}`,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function getBalanceDaysForClientsRequest() {
    return axios.get(
        `${balanceDayURL}clients-statistics`,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function getBalanceDayForSelectedDate(date) {
    if (date) {
        const convertedDate = date.format('YYYY-MM-DD')
        return axios.get(
            `${balanceDayURL}selected-date?selected-date=${convertedDate}`,
            getConfigForAxiosAuthenticatedRequest()
        )
    }
}
