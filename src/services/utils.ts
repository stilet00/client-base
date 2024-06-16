import { localStorageTokenKey } from "../constants/constants";
export const getUserTokenFromLocalStorage = () =>
	window.localStorage.getItem(localStorageTokenKey);

export const getConfigForAxiosAuthenticatedRequest = () => {
	const userToken = getUserTokenFromLocalStorage();
	const axiosConfig = {
		headers: {
			Authorization: `Bearer: ${userToken}`,
		},
	};
	return axiosConfig;
};
