import axios from 'axios'
import { rootURL } from '../rootURL'
const translatorsURL = rootURL + 'translators/'

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
