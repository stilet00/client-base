"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdminStatus = void 0;
var react_redux_1 = require("react-redux");
function useAdminStatus() {
	var user = (0, react_redux_1.useSelector)(function (state) {
		return state.auth.user;
	});
	if (!user) {
		return false;
	}
	return user.isAdmin;
}
exports.useAdminStatus = useAdminStatus;
