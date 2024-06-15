import requestWithAuth from "../superAgentConfig";
import { rootURL } from "../rootURL";

const balanceURL = `${rootURL}balance/`;

export function getBalance() {
	return requestWithAuth("get", `${balanceURL}get/`);
}

export function addMonth(date) {
	return requestWithAuth("post", `${balanceURL}add/`).send(date);
}

export function removeYear(id) {
	return requestWithAuth("delete", `${balanceURL}${id}`);
}

export function changeChartValue(chart) {
	return requestWithAuth("put", `${balanceURL}${chart._id}`).send(chart);
}
