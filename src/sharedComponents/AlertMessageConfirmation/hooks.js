"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAlertConfirmation = void 0;
var react_1 = require("react");
function useAlertConfirmation() {
    var _a = (0, react_1.useState)(false), alertStatusConfirmation = _a[0], setAlertStatusConfirmation = _a[1];
    var openAlertConfirmation = (0, react_1.useCallback)(function () {
        setAlertStatusConfirmation(true);
    }, []);
    var closeAlertConfirmationNoReload = (0, react_1.useCallback)(function () {
        setAlertStatusConfirmation(false);
    }, []);
    return {
        alertStatusConfirmation: alertStatusConfirmation,
        openAlertConfirmation: openAlertConfirmation,
        closeAlertConfirmationNoReload: closeAlertConfirmationNoReload,
    };
}
exports.useAlertConfirmation = useAlertConfirmation;
