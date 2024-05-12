"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootURL = void 0;
var rootURLOptions = {
    staging: 'https://sunrise-agency-staging-fdbbf113d1fd.herokuapp.com/',
    production: 'https://sunrise-agency.herokuapp.com/',
    development: 'http://localhost:80/',
};
exports.rootURL = rootURLOptions[process.env.NODE_ENV];
