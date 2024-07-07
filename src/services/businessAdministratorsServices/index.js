"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusinessAdmins = void 0;
var superAgentConfig_1 = __importDefault(require("../superAgentConfig"));
var rootURL_1 = require("../rootURL");
var businessAdminsURL = rootURL_1.rootURL + "business-admins/";
function getBusinessAdmins(_a) {
	var _b = _a.searchQuery,
		searchQuery = _b === void 0 ? "" : _b;
	var queryParams = "";
	if (searchQuery) {
		queryParams +=
			(queryParams ? "&" : "?") +
			"searchQuery=".concat(encodeURIComponent(searchQuery));
	}
	return (0, superAgentConfig_1.default)(
		"get",
		businessAdminsURL + "get/" + queryParams,
	);
}
exports.getBusinessAdmins = getBusinessAdmins;
