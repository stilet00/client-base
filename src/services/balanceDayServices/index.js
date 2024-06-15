import requestWithAuth from "../superAgentConfig";
import { rootURL } from "../rootURL";

const balanceDayURL = `${rootURL}balance-day/`;

export function getBalanceDaysForOverviewRequest({ yearFilter = "" }) {
	return requestWithAuth("get", `${balanceDayURL}all?yearFilter=${yearFilter}`);
}

export const getBalanceTotalForCurrentMonthRequest = async () => {
	return requestWithAuth("get", `${balanceDayURL}current-month-total`);
};

export function getBalanceDaysForChartsRequest({ yearFilter = "" }) {
	return requestWithAuth("get", `${balanceDayURL}all?yearFilter=${yearFilter}`);
}

export function getBalanceDaysForClientsRequest() {
	return requestWithAuth("get", `${balanceDayURL}clients-statistics`);
}

export function getBalanceDayForSelectedDate(date) {
	if (date) {
		return requestWithAuth(
			"get",
			`${balanceDayURL}selected-date?selected-date=${date}`,
		);
	}
}
