import requestWithAuth from "./superAgentConfig";
import { rootURL } from "./rootURL";

const chartsURL = `${rootURL}charts`;

export function getChartsRequest({ yearFilter = "", monthFilter = "" }) {
	return requestWithAuth(
		"get",
		`${chartsURL}?yearFilter=${yearFilter}&monthFilter=${monthFilter}`,
	);
}
