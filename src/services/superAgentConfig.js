"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var superagent_1 = __importDefault(require("superagent"));
var constants_1 = require("../constants/constants");
var getUserTokenFromLocalStorage = function () {
    return window.localStorage.getItem(constants_1.localStorageTokenKey);
};
var authMiddleware = function (request) {
    var userToken = getUserTokenFromLocalStorage();
    if (userToken) {
        request.set("Authorization", "Bearer ".concat(userToken));
    }
    return request;
};
var requestWithAuth = function (method, url) {
    return authMiddleware((0, superagent_1.default)(method, url));
};
exports.default = requestWithAuth;
