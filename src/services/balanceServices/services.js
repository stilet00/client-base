import axios from "axios";
import { rootURL } from "../rootURL";

const balanceURL = rootURL + "balance/";

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
