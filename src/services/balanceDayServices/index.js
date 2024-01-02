import axios from 'axios'
import { rootURL } from '../rootURL'
import { getConfigForAxiosAuthenticatedRequest } from '../utils'

const balanceDayURL = rootURL + 'balance-day/'

export function getBalanceDaysRequest({ yearFilter = '' }) {
    return axios.get(
        `${balanceDayURL}all?yearFilter=${yearFilter}`,
        getConfigForAxiosAuthenticatedRequest()
    )
}
