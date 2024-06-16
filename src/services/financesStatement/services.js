import axios from "axios";
import { rootURL } from "../rootURL";
import { getConfigForAxiosAuthenticatedRequest } from "../utils";

const financeStatementsURL = rootURL + "statements/";

export function getPaymentsRequest({ yearFilter = "" }) {
	let requestURL = financeStatementsURL + "get/";
	if (yearFilter) {
		requestURL += "?year=" + yearFilter;
	}
	return axios.get(requestURL, getConfigForAxiosAuthenticatedRequest());
}

export async function addPaymentRequest(payment) {
	return axios.post(
		financeStatementsURL + "add/",
		payment,
		getConfigForAxiosAuthenticatedRequest(),
	);
}

export function removePaymentRequest(id) {
	return axios.delete(
		financeStatementsURL + id,
		getConfigForAxiosAuthenticatedRequest(),
	);
}
