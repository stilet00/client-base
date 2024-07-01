"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHARTS_CATEGORIES =
	exports.FINANCE_IMAGES =
	exports.FINANCE_AVATARS =
	exports.TASKS_BACKGROUNDS =
		void 0;
var MonetizationOn_1 = __importDefault(
	require("@mui/icons-material/MonetizationOn"),
);
var CreditScore_1 = __importDefault(require("@mui/icons-material/CreditScore"));
var FaceRetouchingNatural_1 = __importDefault(
	require("@mui/icons-material/FaceRetouchingNatural"),
);
var AdUnits_1 = __importDefault(require("@mui/icons-material/AdUnits"));
var colors_1 = require("@mui/material/colors");
var Chat_1 = __importDefault(require("@mui/icons-material/Chat"));
var Email_1 = __importDefault(require("@mui/icons-material/Email"));
var Favorite_1 = __importDefault(require("@mui/icons-material/Favorite"));
var PermPhoneMsg_1 = __importDefault(
	require("@mui/icons-material/PermPhoneMsg"),
);
var CardGiftcard_1 = __importDefault(
	require("@mui/icons-material/CardGiftcard"),
);
var SignalCellularAlt_1 = __importDefault(
	require("@mui/icons-material/SignalCellularAlt"),
);
var KeyboardVoice_1 = __importDefault(
	require("@mui/icons-material/KeyboardVoice"),
);
var logo_png_1 = __importDefault(require("../images/logo.png"));
var anton_avatar_png_1 = __importDefault(
	require("../images/avatars/anton-avatar.png"),
);
var sasha_avatar_png_1 = __importDefault(
	require("../images/avatars/sasha-avatar.png"),
);
var background1_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background1.png"),
);
var background2_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background2.png"),
);
var background3_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background3.png"),
);
var background4_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background4.png"),
);
var background5_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background5.png"),
);
var background6_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background6.png"),
);
var background7_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background7.png"),
);
var background8_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background8.png"),
);
var background9_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background9.png"),
);
var background10_png_1 = __importDefault(
	require("../images/tasks_backgrounds/background10.png"),
);
exports.TASKS_BACKGROUNDS = [
	background1_png_1.default,
	background2_png_1.default,
	background3_png_1.default,
	background4_png_1.default,
	background5_png_1.default,
	background6_png_1.default,
	background7_png_1.default,
	background8_png_1.default,
	background9_png_1.default,
	background10_png_1.default,
];
exports.FINANCE_AVATARS = {
	anton: anton_avatar_png_1.default,
	oleksandr: sasha_avatar_png_1.default,
	agency: logo_png_1.default,
};
exports.FINANCE_IMAGES = {
	salary: function () {
		return (
			<MonetizationOn_1.default
				sx={{ fontSize: 40, color: colors_1.green[400] }}
			/>
		);
	},
	paymentToScout: function () {
		return (
			<CreditScore_1.default sx={{ fontSize: 40, color: colors_1.blue[500] }} />
		);
	},
	paymentToBot: function () {
		return (
			<AdUnits_1.default sx={{ fontSize: 40, color: colors_1.purple[500] }} />
		);
	},
	paymentToTranslator: function () {
		return (
			<FaceRetouchingNatural_1.default
				sx={{ fontSize: 40, color: colors_1.cyan[500] }}
			/>
		);
	},
};
exports.CHARTS_CATEGORIES = [
	{
		name: "All",
		value: null,
		icon: <SignalCellularAlt_1.default />,
	},
	{
		name: "Chats",
		value: "chats",
		icon: <Chat_1.default />,
	},
	{
		name: "Letters",
		value: "letters",
		icon: <Email_1.default />,
	},
	{
		name: "Dating",
		value: "dating",
		icon: <Favorite_1.default sx={{ color: "red" }} />,
	},
	{
		name: "Phone Calls",
		value: "phoneCalls",
		icon: <PermPhoneMsg_1.default />,
	},
	{
		name: "Virtual Gifts Svadba",
		value: "virtualGiftsSvadba",
		icon: <CardGiftcard_1.default />,
	},
	{
		name: "Voice Messages",
		value: "voiceMessages",
		icon: <KeyboardVoice_1.default sx={{ color: "red" }} />,
	},
	{
		name: "Attachments",
		value: "photoAttachments",
	},
	{
		name: "Voice Messages",
		value: "voiceMessages",
	},
	{
		name: "Penalties",
		value: "penalties",
	},
];
