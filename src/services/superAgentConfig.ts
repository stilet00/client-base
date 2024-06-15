import superagent, { type SuperAgentRequest } from "superagent";
import { localStorageTokenKey } from "../constants/constants";

const getUserTokenFromLocalStorage = (): string | null =>
	window.localStorage.getItem(localStorageTokenKey);

const authMiddleware = (request: SuperAgentRequest): SuperAgentRequest => {
	const userToken = getUserTokenFromLocalStorage();
	if (userToken) {
		request.set("Authorization", `Bearer ${userToken}`);
	}
	return request;
};

const requestWithAuth = (
	method: "get" | "post" | "put" | "delete" | "patch",
	url: string,
): SuperAgentRequest => {
	return authMiddleware(superagent(method, url));
};

export default requestWithAuth;
