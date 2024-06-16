"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigForAxiosAuthenticatedRequest =
	exports.getUserTokenFromLocalStorage = void 0;
var constants_1 = require("../constants/constants");
var getUserTokenFromLocalStorage = function () {
	return window.localStorage.getItem(constants_1.localStorageTokenKey);
};
exports.getUserTokenFromLocalStorage = getUserTokenFromLocalStorage;
var getConfigForAxiosAuthenticatedRequest = function () {
	var userToken = (0, exports.getUserTokenFromLocalStorage)();
	var axiosConfig = {
		headers: {
			Authorization: "Bearer: ".concat(userToken),
		},
	};
	return axiosConfig;
};
exports.getConfigForAxiosAuthenticatedRequest =
	getConfigForAxiosAuthenticatedRequest;
