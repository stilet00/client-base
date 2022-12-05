import axios from 'axios'

const currencyURL =
    'https://api.currencyapi.com/v3/latest?apikey=KmA41cfqr82rJ9izxT07gnVXImqmTC9cE86a4x06'

export function getCurrency() {
    return axios.get(currencyURL, {
        headers: { 'Access-Control-Allow-Origin': 'origin-list' },
        responseType: 'json',
    })
}
