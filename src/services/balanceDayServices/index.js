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
