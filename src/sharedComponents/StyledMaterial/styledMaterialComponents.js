"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyledTextField = exports.StyledFormControl = exports.StyledModal = void 0;
var system_1 = require("@mui/system");
var Modal_1 = __importDefault(require("@mui/material/Modal"));
var FormControl_1 = __importDefault(require("@mui/material/FormControl"));
var TextField_1 = __importDefault(require("@mui/material/TextField"));
exports.StyledModal = (0, system_1.styled)(Modal_1.default)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});
exports.StyledFormControl = (0, system_1.styled)(FormControl_1.default)({
    margin: '1rem',
    minWidth: 120,
});
exports.StyledTextField = (0, system_1.styled)(TextField_1.default)({
    '& .MuiInputBase-root:first-child': {
        background: 'rgba(210,206,206,0.5)',
    },
});
