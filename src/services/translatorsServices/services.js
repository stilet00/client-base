"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleClientSuspendedRequest = exports.createPersonalPenalty = exports.getPenaltiesForTranslatorRequest = exports.getBalanceDaysForTranslatorRequest = exports.updateBalanceDay = exports.createBalanceDay = exports.getBalanceDay = exports.sendLastVirtualGiftDateRequest = exports.sendNotificationEmailsRequest = exports.assignClientToTranslatorRequest = exports.updateTranslator = exports.removeTranslator = exports.addTranslator = exports.getTranslators = void 0;
var superAgentConfig_1 = __importDefault(require("../superAgentConfig"));
var rootURL_1 = require("../rootURL");
var translatorsURL = rootURL_1.rootURL + "translators/";
var balanceDayURL = rootURL_1.rootURL + "balance-day/";
var personalPenaltyURL = rootURL_1.rootURL + "personal-penalty/";
function getTranslators(_a) {
    var _b = _a.searchQuery, searchQuery = _b === void 0 ? "" : _b, _c = _a.shouldGetClients, shouldGetClients = _c === void 0 ? false : _c;
    var queryParams = "";
    if (searchQuery) {
        queryParams +=
            (queryParams ? "&" : "?") +
                "searchQuery=".concat(encodeURIComponent(searchQuery));
    }
    if (shouldGetClients) {
        queryParams += (queryParams ? "&" : "?") + "shouldGetClients=true";
    }
    return (0, superAgentConfig_1.default)("get", translatorsURL + "get/" + queryParams);
}
exports.getTranslators = getTranslators;
function addTranslator(translator) {
    return (0, superAgentConfig_1.default)("post", translatorsURL + "add/").send(translator);
}
exports.addTranslator = addTranslator;
function removeTranslator(id) {
    return (0, superAgentConfig_1.default)("delete", translatorsURL + id);
}
exports.removeTranslator = removeTranslator;
function updateTranslator(translator) {
    return (0, superAgentConfig_1.default)("put", translatorsURL + translator._id).send(translator);
}
exports.updateTranslator = updateTranslator;
function assignClientToTranslatorRequest(_a) {
    var clientId = _a.clientId, translatorId = _a.translatorId;
    return (0, superAgentConfig_1.default)("put", translatorsURL + "assign-client").send({
        clientId: clientId,
        translatorId: translatorId,
    });
}
exports.assignClientToTranslatorRequest = assignClientToTranslatorRequest;
function sendNotificationEmailsRequest() {
    return (0, superAgentConfig_1.default)("get", translatorsURL + "send-emails");
}
exports.sendNotificationEmailsRequest = sendNotificationEmailsRequest;
function sendLastVirtualGiftDateRequest(id) {
    return (0, superAgentConfig_1.default)("get", translatorsURL + "last-gift/" + id);
}
exports.sendLastVirtualGiftDateRequest = sendLastVirtualGiftDateRequest;
function getBalanceDay(_a) {
    var translatorId = _a.translatorId, clientId = _a.clientId, dateTimeId = _a.dateTimeId;
    return (0, superAgentConfig_1.default)("get", "".concat(balanceDayURL, "?translatorId=").concat(translatorId, "&clientId=").concat(clientId, "&dateTimeId=").concat(encodeURIComponent(dateTimeId)));
}
exports.getBalanceDay = getBalanceDay;
function createBalanceDay(_a) {
    var newBalanceDay = _a.newBalanceDay;
    return (0, superAgentConfig_1.default)("post", balanceDayURL + "create").send(__assign({}, newBalanceDay));
}
exports.createBalanceDay = createBalanceDay;
function updateBalanceDay(_a) {
    var balanceDayToSubmit = _a.balanceDayToSubmit;
    return (0, superAgentConfig_1.default)("put", balanceDayURL + "update").send(__assign({}, balanceDayToSubmit));
}
exports.updateBalanceDay = updateBalanceDay;
function getBalanceDaysForTranslatorRequest(_a) {
    var _b = _a.dateTimeFilter, dateTimeFilter = _b === void 0 ? "" : _b, _c = _a.translatorId, translatorId = _c === void 0 ? "" : _c;
    return (0, superAgentConfig_1.default)("get", "".concat(balanceDayURL, "translators?dateTimeFilter=").concat(dateTimeFilter, "&translatorId=").concat(translatorId));
}
exports.getBalanceDaysForTranslatorRequest = getBalanceDaysForTranslatorRequest;
function getPenaltiesForTranslatorRequest(_a) {
    var _b = _a.dateTimeFilter, dateTimeFilter = _b === void 0 ? "" : _b, _c = _a.translatorId, translatorId = _c === void 0 ? "" : _c;
    return (0, superAgentConfig_1.default)("get", "".concat(personalPenaltyURL, "get?dateTimeFilter=").concat(dateTimeFilter, "&translatorId=").concat(translatorId));
}
exports.getPenaltiesForTranslatorRequest = getPenaltiesForTranslatorRequest;
function createPersonalPenalty(_a) {
    var personalPenaltyData = _a.personalPenaltyData;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, (0, superAgentConfig_1.default)("post", "".concat(personalPenaltyURL, "create")).send(personalPenaltyData)];
        });
    });
}
exports.createPersonalPenalty = createPersonalPenalty;
function toggleClientSuspendedRequest(_a) {
    var clientId = _a.clientId, translatorId = _a.translatorId;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, (0, superAgentConfig_1.default)("put", "".concat(translatorsURL, "suspend-client")).send({
                    clientId: clientId,
                    translatorId: translatorId,
                })];
        });
    });
}
exports.toggleClientSuspendedRequest = toggleClientSuspendedRequest;
