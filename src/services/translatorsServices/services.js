import axios from "axios";
const translatorsURL = "http://localhost:80/translators/";
// const translatorsURL = "https://sunrise-agency.herokuapp.com/translators/";

export function getTranslators() {
  return axios.get(translatorsURL + "get/");
}
export function addTranslator(translator) {
  return axios.post(translatorsURL + "add/", translator);
}
export function removeTranslator(id) {
  return axios.delete(translatorsURL + id);
}
export function updateTranslator(translator) {
  return axios.put(translatorsURL + translator._id, translator);
}
