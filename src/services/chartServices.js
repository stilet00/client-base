"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartsRequest = void 0;
var superAgentConfig_1 = __importDefault(require("./superAgentConfig"));
var rootURL_1 = require("./rootURL");
var chartsURL = "".concat(rootURL_1.rootURL, "charts");
function getChartsRequest(_a) {
	var _b = _a.yearFilter,
		yearFilter = _b === void 0 ? "" : _b,
		_c = _a.monthFilter,
		monthFilter = _c === void 0 ? "" : _c;
	return (0, superAgentConfig_1.default)(
		"get",
		""
			.concat(chartsURL, "?yearFilter=")
			.concat(yearFilter, "&monthFilter=")
			.concat(monthFilter),
	);
}
exports.getChartsRequest = getChartsRequest;
