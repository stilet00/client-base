import requestWithAuth from "../superAgentConfig";
import { rootURL } from "../rootURL";

const clientsURL = `${rootURL}clients/`;

export function getClientsRequest({
	noImageParams = false,
	searchQuery = "",
	shouldFillTranslators = false,
}) {
	let queryParams = "";
	if (noImageParams) {
		queryParams = `?noImageParams=${noImageParams}`;
	}
	if (shouldFillTranslators) {
		queryParams += `${queryParams ? "&" : "?"}shouldFillTranslators=${shouldFillTranslators}`;
	}
	if (searchQuery) {
		queryParams += `${queryParams ? "&" : "?"}searchQuery=${encodeURIComponent(searchQuery)}`;
	}
	return requestWithAuth("get", `${clientsURL}get/${queryParams}`);
}

export function addClient(client) {
	return requestWithAuth("post", `${clientsURL}add/`).send(client);
}

export function removeClient(id) {
	return requestWithAuth("delete", `${clientsURL}${id}`);
}

export function updateClient(editedClient) {
	return requestWithAuth("put", `${clientsURL}${editedClient._id}`).send(
		editedClient,
	);
}

export async function getClientsOverviewRequest() {
	const response = await requestWithAuth("get", `${clientsURL}overview`);
	if (response.status === 200) {
		return response.body;
	}
	throw new Error("Something went wrong with clients data");
}
