import requestWithAuth from "../superAgentConfig";
import { rootURL } from "../rootURL";

const financeStatementsURL = `${rootURL}statements/`;

export function getPaymentsRequest({ yearFilter = "" }) {
	let requestURL = `${financeStatementsURL}get/`;
	if (yearFilter) {
		requestURL += `?year=${yearFilter}`;
	}
	return requestWithAuth("get", requestURL);
}

export async function addPaymentRequest(payment) {
	return requestWithAuth("post", `${financeStatementsURL}add/`).send(payment);
}

export function removePaymentRequest(id) {
	return requestWithAuth("delete", `${financeStatementsURL}${id}`);
}
