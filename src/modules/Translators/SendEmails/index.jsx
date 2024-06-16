"use strict";
var __makeTemplateObject =
	(this && this.__makeTemplateObject) ||
	function (cooked, raw) {
		if (Object.defineProperty) {
			Object.defineProperty(cooked, "raw", { value: raw });
		} else {
			cooked.raw = raw;
		}
		return cooked;
	};
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				var desc = Object.getOwnPropertyDescriptor(m, k);
				if (
					!desc ||
					("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
				) {
					desc = {
						enumerable: true,
						get: function () {
							return m[k];
						},
					};
				}
				Object.defineProperty(o, k2, desc);
			}
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				o[k2] = m[k];
			});
var __setModuleDefault =
	(this && this.__setModuleDefault) ||
	(Object.create
		? function (o, v) {
				Object.defineProperty(o, "default", { enumerable: true, value: v });
			}
		: function (o, v) {
				o["default"] = v;
			});
var __importStar =
	(this && this.__importStar) ||
	function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null)
			for (var k in mod)
				if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
					__createBinding(result, mod, k);
		__setModuleDefault(result, mod);
		return result;
	};
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
					});
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === "function" &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y["return"]
									: op[0]
										? y["throw"] || ((t = y["return"]) && t.call(y), 0)
										: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var styled_components_1 = __importDefault(require("styled-components"));
var Button_1 = __importDefault(require("@mui/material/Button"));
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var services_1 = require("../../../services/translatorsServices/services");
var useWindowDimensions_1 = __importDefault(
	require("../../../sharedHooks/useWindowDimensions"),
);
var hooks_1 = require("../../../sharedComponents/AlertMessageConfirmation/hooks");
var useAdminStatus_1 = require("../../../sharedHooks/useAdminStatus");
require("../../../styles/sharedComponents/AlertMessageConfirmation.css");
var Send_1 = __importDefault(require("@mui/icons-material/Send"));
var LoadingButton_1 = __importDefault(require("@mui/lab/LoadingButton"));
var styledMaterialComponents_1 = require("../../../sharedComponents/StyledMaterial/styledMaterialComponents");
function SendEmailDialog(_a) {
	var mainText = _a.mainText,
		additionalText = _a.additionalText,
		handleClose = _a.handleClose,
		open = _a.open,
		status = _a.status,
		onConfirm = _a.onConfirm,
		onCancel = _a.onCancel,
		loadingStatus = _a.loadingStatus,
		isDisabled = _a.isDisabled;
	return (
		<styledMaterialComponents_1.StyledModal open={open} onClose={handleClose}>
			<div
				className={
					status
						? "message-container approve-box"
						: "message-container decline-box"
				}
			>
				<h2
					className={status ? "green-text" : "red-text"}
					style={{ paddingBottom: 10 }}
				>
					{mainText}
				</h2>
				{additionalText ? (
					<p style={{ paddingBottom: 10 }}>{additionalText}</p>
				) : null}
				<div className="confirmation-buttons">
					<Button_1.default variant={"outlined"} onClick={onCancel}>
						CANCEL
					</Button_1.default>
					<LoadingButton_1.default
						disabled={isDisabled}
						onClick={onConfirm}
						endIcon={<Send_1.default />}
						loading={loadingStatus}
						loadingPosition="end"
						variant="contained"
					>
						CONFIRM
					</LoadingButton_1.default>
				</div>
			</div>
		</styledMaterialComponents_1.StyledModal>
	);
}
var StyledButton = (0, styled_components_1.default)(Button_1.default)(
	templateObject_1 ||
		(templateObject_1 = __makeTemplateObject(
			["\n    && {\n        color: black;\n    }\n"],
			["\n    && {\n        color: black;\n    }\n"],
		)),
);
var defaultMessage =
	"Continue, if you've finished all work in translator's statistics";
var SendEmails = function () {
	var _a = (0, react_1.useState)(false),
		mailoutInProgress = _a[0],
		setMailoutInProgress = _a[1];
	var _b = (0, react_1.useState)(defaultMessage),
		displayMessage = _b[0],
		setDisplayMessage = _b[1];
	var _c = (0, react_1.useState)(false),
		isDisabled = _c[0],
		setIsDisabled = _c[1];
	var user = (0, react_redux_1.useSelector)(function (state) {
		return state.auth.user;
	});
	var isAdmin = (0, useAdminStatus_1.useAdminStatus)(user).isAdmin;
	var _d = (0, hooks_1.useAlertConfirmation)(),
		alertStatusConfirmation = _d.alertStatusConfirmation,
		openAlertConfirmation = _d.openAlertConfirmation,
		closeAlertConfirmationNoReload = _d.closeAlertConfirmationNoReload;
	var screenIsSmall = (0, useWindowDimensions_1.default)().screenIsSmall;
	var sendNotificationEmails = function () {
		return __awaiter(void 0, void 0, void 0, function () {
			var res, error_1;
			var _a, _b;
			return __generator(this, function (_c) {
				switch (_c.label) {
					case 0:
						setMailoutInProgress(true);
						_c.label = 1;
					case 1:
						_c.trys.push([1, 3, 4, 5]);
						return [
							4 /*yield*/,
							(0, services_1.sendNotificationEmailsRequest)(),
						];
					case 2:
						res = _c.sent();
						if (res.status === 200) {
							setDisplayMessage(
								"Emails have been sent to: ".concat(res.data.join(", ")),
							);
						}
						return [3 /*break*/, 5];
					case 3:
						error_1 = _c.sent();
						setDisplayMessage(
							((_b =
								(_a =
									error_1 === null || error_1 === void 0
										? void 0
										: error_1.response) === null || _a === void 0
									? void 0
									: _a.data) === null || _b === void 0
								? void 0
								: _b.error) || "An error occurred",
						);
						return [3 /*break*/, 5];
					case 4:
						setMailoutInProgress(false);
						setIsDisabled(true);
						setTimeout(function () {
							closeAlertConfirmationNoReload();
							setDisplayMessage(defaultMessage);
						}, 5000);
						return [7 /*endfinally*/];
					case 5:
						return [2 /*return*/];
				}
			});
		});
	};
	return (
		<>
			<StyledButton
				aria-describedby={"send-emails"}
				onClick={openAlertConfirmation}
				fullWidth={screenIsSmall}
				disabled={!isAdmin}
				className="translators-container__menu-button"
				startIcon={
					<react_fontawesome_1.FontAwesomeIcon
						icon={free_solid_svg_icons_1.faPaperPlane}
					/>
				}
			>
				Send emails
			</StyledButton>
			<SendEmailDialog
				isDisabled={isDisabled}
				mainText={"Please confirm mailout"}
				additionalText={displayMessage}
				open={alertStatusConfirmation}
				handleClose={closeAlertConfirmationNoReload}
				status={false}
				onCancel={closeAlertConfirmationNoReload}
				onConfirm={sendNotificationEmails}
				loadingStatus={mailoutInProgress}
			/>
		</>
	);
};
exports.default = SendEmails;
var templateObject_1;
