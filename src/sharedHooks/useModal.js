"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useModal() {
	var _a = (0, react_1.useState)(false),
		open = _a[0],
		setOpen = _a[1];
	var handleOpen = (0, react_1.useCallback)(function () {
		setOpen(true);
	}, []);
	var handleClose = (0, react_1.useCallback)(function () {
		setOpen(false);
	}, []);
	return {
		handleOpen: handleOpen,
		handleClose: handleClose,
		open: open,
	};
}
exports.default = useModal;
