import requestWithAuth from "../superAgentConfig";
import { rootURL } from "../rootURL";

const businessAdminsURL = rootURL + "business-admins/";

export function getBusinessAdmins({ searchQuery = "" }) {
	let queryParams = "";
	if (searchQuery) {
		queryParams +=
			(queryParams ? "&" : "?") +
			`searchQuery=${encodeURIComponent(searchQuery)}`;
	}
	return requestWithAuth("get", businessAdminsURL + "get/" + queryParams);
}
