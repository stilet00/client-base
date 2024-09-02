"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootURL = exports.rootURLOptions = void 0;
exports.rootURLOptions = {
	staging: "https://sunrise-agency-staging-73929348db48.herokuapp.com/",
	production: "https://sunrise-agency.herokuapp.com/",
	development: "http://localhost:80/",
};
console.log("process.env.NODE_ENV at front: ".concat(process.env.NODE_ENV));
exports.rootURL = exports.rootURLOptions[process.env.NODE_ENV];
