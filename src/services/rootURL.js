"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootURL = exports.rootURLOptions = void 0;
exports.rootURLOptions = {
	staging: "https://sunrise-agency-staging-73929348db48.herokuapp.com/",
	production: "https://sunrise-agency.herokuapp.com/",
	development: "http://localhost:80/",
};
exports.rootURL =
	(_a = exports.rootURLOptions[process.env.REACT_APP_ENVIRONMENT]) !== null &&
	_a !== void 0
		? _a
		: "development";
