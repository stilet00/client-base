import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import { purple, blue, green, cyan } from "@mui/material/colors";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PermPhoneMsgIcon from "@mui/icons-material/PermPhoneMsg";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import Agency_avatar from "../images/logo.png";
import Anton_avatar from "../images/avatars/anton-avatar.png";
import Oleksandr_avatar from "../images/avatars/sasha-avatar.png";
import background1 from "../images/tasks_backgrounds/background1.png";
import background2 from "../images/tasks_backgrounds/background2.png";
import background3 from "../images/tasks_backgrounds/background3.png";
import background4 from "../images/tasks_backgrounds/background4.png";
import background5 from "../images/tasks_backgrounds/background5.png";
import background6 from "../images/tasks_backgrounds/background6.png";
import background7 from "../images/tasks_backgrounds/background7.png";
import background8 from "../images/tasks_backgrounds/background8.png";
import background9 from "../images/tasks_backgrounds/background9.png";
import background10 from "../images/tasks_backgrounds/background10.png";

export const TASKS_BACKGROUNDS = [
	background1,
	background2,
	background3,
	background4,
	background5,
	background6,
	background7,
	background8,
	background9,
	background10,
];

export const FINANCE_AVATARS = {
	anton: Anton_avatar,
	oleksandr: Oleksandr_avatar,
	agency: Agency_avatar,
};

export const FINANCE_IMAGES = {
	salary: () => <MonetizationOnIcon sx={{ fontSize: 40, color: green[400] }} />,
	paymentToScout: () => (
		<CreditScoreIcon sx={{ fontSize: 40, color: blue[500] }} />
	),
	paymentToBot: () => <AdUnitsIcon sx={{ fontSize: 40, color: purple[500] }} />,
	paymentToTranslator: () => (
		<FaceRetouchingNaturalIcon sx={{ fontSize: 40, color: cyan[500] }} />
	),
};

type ChartCategory = {
	name: string;
	value: string | null;
	icon?: JSX.Element;
};

export const CHARTS_CATEGORIES: ChartCategory[] = [
	{
		name: "All",
		value: null,
		icon: <SignalCellularAltIcon />,
	},
	{
		name: "Chats",
		value: "chats",
		icon: <ChatIcon />,
	},
	{
		name: "Letters",
		value: "letters",
		icon: <EmailIcon />,
	},
	{
		name: "Dating",
		value: "dating",
		icon: <FavoriteIcon sx={{ color: "red" }} />,
	},
	{
		name: "Phone Calls",
		value: "phoneCalls",
		icon: <PermPhoneMsgIcon />,
	},
	{
		name: "Virtual Gifts Svadba",
		value: "virtualGiftsSvadba",
		icon: <CardGiftcardIcon />,
	},
	{
		name: "Voice Messages",
		value: "voiceMessages",
		icon: <KeyboardVoiceIcon sx={{ color: "red" }} />,
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
