"use strict";
var __assign =
	(this && this.__assign) ||
	function () {
		__assign =
			Object.assign ||
			function (t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s)
						if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
require("styles/sharedComponents/Loader.css");
function Loader(_a) {
	var _b = _a.position,
		position = _b === void 0 ? undefined : _b,
		_c = _a.style,
		style = _c === void 0 ? {} : _c,
		_d = _a.loaderColor,
		loaderColor = _d === void 0 ? undefined : _d;
	return (
		<div className="lds-facebook" style={__assign({ top: position }, style)}>
			<div style={loaderColor ? { background: loaderColor } : {}}></div>
			<div style={loaderColor ? { background: loaderColor } : {}}></div>
			<div style={loaderColor ? { background: loaderColor } : {}}></div>
		</div>
	);
}
exports.default = Loader;
