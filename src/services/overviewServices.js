"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverviewDataRequest = void 0;
var superAgentConfig_1 = __importDefault(require("./superAgentConfig"));
var rootURL_1 = require("./rootURL");
var overviewURL = "".concat(rootURL_1.rootURL, "overview");
function getOverviewDataRequest(_a) {
	var _b = _a.selectedYear,
		selectedYear = _b === void 0 ? "2024" : _b;
	return (0, superAgentConfig_1.default)(
		"get",
		"".concat(overviewURL, "/get?selectedYear=").concat(selectedYear),
	);
}
exports.getOverviewDataRequest = getOverviewDataRequest;
