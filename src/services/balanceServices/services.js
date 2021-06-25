import axios from "axios";
const balanceURL = "http://localhost:80/balance/";
// const balanceURL = "https://sunrise-agency.herokuapp.com/balance/"

export function getBalance() {
  return axios.get(balanceURL + "get/");
}
export function addMonth(date) {
  let label = { label: `${date.month} ${date.year}`, data: [] };
  return axios.post(balanceURL + "add/", label);
}
export function removeYear(id) {
  return axios.delete(balanceURL + id);
}
