"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootURL = void 0;
exports.rootURL =
	process.env.NODE_ENV === "development"
		? "http://localhost:80/"
		: "".concat(window.location.origin, "/");
