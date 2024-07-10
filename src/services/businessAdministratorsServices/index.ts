import requestWithAuth from "../superAgentConfig";
import { rootURL } from "../rootURL";
import { BusinessAdmin } from "api/models/businessAdminsDatabaseModels";

const businessAdminsURL = rootURL + "business-admins/";

export function getBusinessAdmins({ searchQuery = "" }) {
	let queryParams = "";
	if (searchQuery) {
		queryParams +=
			(queryParams ? "&" : "?") +
			`searchQuery=${encodeURIComponent(searchQuery)}`;
	}
	return requestWithAuth("get", businessAdminsURL + queryParams);
}

export function submitBusinessAdmin(businessAdminData: BusinessAdmin) {
	return requestWithAuth("post", businessAdminsURL).send(businessAdminData);
}
