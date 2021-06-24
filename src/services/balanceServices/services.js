import axios from "axios";
// const balanceURL = "http://localhost:80/balance/";
const balanceURL = "https://sunrise-agency.herokuapp.com/balance/"

export function getBalance() {
  return axios.get(balanceURL + "get/");
}
export function addYear() {
  const year = { label: 2021, data: [20, 19, 3, 5, 2, 3, 1, 2, 3, 4, 5, 15] };
  return axios.post(balanceURL + "add/", year);
}
export function removeYear(id) {
  return axios.delete(balanceURL + id);
}
