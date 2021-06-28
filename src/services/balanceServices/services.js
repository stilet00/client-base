import axios from "axios";
// const balanceURL = "http://localhost:80/balance/";
const balanceURL = "https://sunrise-agency.herokuapp.com/balance/"

export function getBalance() {
  return axios.get(balanceURL + "get/");
}
export function addMonth(date) {
  return axios.post(balanceURL + "add/", date);
}
export function removeYear(id) {
  return axios.delete(balanceURL + id);
}
export function changeChartValue(chart) {
  return axios.put(balanceURL + chart._id, chart);
}
