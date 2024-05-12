"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYONEER_COMISSION = exports.TRANSLATORS_SALARY_PERCENT = exports.CHARTS_CATEGORIES = exports.BOT_LIST = exports.DEFAULT_STATEMENT = exports.FINANCE_COMMENTS = exports.FINANCE_IMAGES = exports.FINANCE_AVATARS = exports.FINANCE_SENDERS = exports.TASKS_BACKGROUNDS = exports.DEFAULT_CATEGORIES = exports.SUNRISE_AGENCY_ID = exports.DEFAULT_TRANSLATOR = exports.DEFAULT_ERROR = exports.EMPTY_BALANCE_DAY = exports.DEFAULT_MONTH_CHART = exports.DEFAULT_PENALTY = exports.DEFAULT_CLIENT = exports.localStorageTokenKey = exports.inactivityPeriod = exports.arrayOfYearsForSelectFilter = exports.appStartYear = exports.previousDay = exports.previousMonth = exports.currentMonth = exports.previousYear = exports.currentYear = void 0;
var sharedFunctions_1 = require("../sharedFunctions/sharedFunctions");
var moment_1 = __importDefault(require("moment"));
var background1_png_1 = __importDefault(require("../images/tasks_backgrounds/background1.png"));
var background2_png_1 = __importDefault(require("../images/tasks_backgrounds/background2.png"));
var background3_png_1 = __importDefault(require("../images/tasks_backgrounds/background3.png"));
var background4_png_1 = __importDefault(require("../images/tasks_backgrounds/background4.png"));
var background5_png_1 = __importDefault(require("../images/tasks_backgrounds/background5.png"));
var background6_png_1 = __importDefault(require("../images/tasks_backgrounds/background6.png"));
var background7_png_1 = __importDefault(require("../images/tasks_backgrounds/background7.png"));
var background8_png_1 = __importDefault(require("../images/tasks_backgrounds/background8.png"));
var background9_png_1 = __importDefault(require("../images/tasks_backgrounds/background9.png"));
var background10_png_1 = __importDefault(require("../images/tasks_backgrounds/background10.png"));
var logo_png_1 = __importDefault(require("../images/logo.png"));
var anton_avatar_png_1 = __importDefault(require("../images/avatars/anton-avatar.png"));
var sasha_avatar_png_1 = __importDefault(require("../images/avatars/sasha-avatar.png"));
var MonetizationOn_1 = __importDefault(require("@mui/icons-material/MonetizationOn"));
var FaceRetouchingNatural_1 = __importDefault(require("@mui/icons-material/FaceRetouchingNatural"));
var CreditScore_1 = __importDefault(require("@mui/icons-material/CreditScore"));
var AdUnits_1 = __importDefault(require("@mui/icons-material/AdUnits"));
var colors_1 = require("@mui/material/colors");
var Chat_1 = __importDefault(require("@mui/icons-material/Chat"));
var Email_1 = __importDefault(require("@mui/icons-material/Email"));
var Favorite_1 = __importDefault(require("@mui/icons-material/Favorite"));
var PermPhoneMsg_1 = __importDefault(require("@mui/icons-material/PermPhoneMsg"));
var CardGiftcard_1 = __importDefault(require("@mui/icons-material/CardGiftcard"));
var SignalCellularAlt_1 = __importDefault(require("@mui/icons-material/SignalCellularAlt"));
var KeyboardVoice_1 = __importDefault(require("@mui/icons-material/KeyboardVoice"));
exports.currentYear = (0, moment_1.default)().utc().format('YYYY');
exports.previousYear = (0, moment_1.default)().utc().subtract(1, 'year').format('YYYY');
exports.currentMonth = (0, moment_1.default)().utc().format('M');
exports.previousMonth = (0, moment_1.default)().utc().subtract(1, 'month').format('M');
exports.previousDay = (0, moment_1.default)().utc().subtract(1, 'day').format('D');
exports.appStartYear = 2022;
exports.arrayOfYearsForSelectFilter = creatArrayOfYears();
exports.inactivityPeriod = 1000 * 60 * 20;
exports.localStorageTokenKey = 'clientBaseUserToken';
exports.DEFAULT_CLIENT = {
    name: '',
    surname: '',
    bankAccount: '',
    instagramLink: '',
    suspended: false,
    svadba: {
        login: '',
        password: '',
    },
    dating: {
        login: '',
        password: '',
    },
    image: '',
};
var DEFAULT_PENALTY = /** @class */ (function () {
    function DEFAULT_PENALTY(translatorId, dateTimeId) {
        this.dateTimeId = dateTimeId;
        this.amount = 0;
        this.description = '';
        this.translator = translatorId;
    }
    return DEFAULT_PENALTY;
}());
exports.DEFAULT_PENALTY = DEFAULT_PENALTY;
var DEFAULT_MONTH_CHART = /** @class */ (function () {
    function DEFAULT_MONTH_CHART(year, month) {
        this.year = year;
        this.month = (0, sharedFunctions_1.getStringMonthNumber)(month);
        this.days = (0, sharedFunctions_1.getTotalDaysOfMonth)(year, month);
        this.values = [];
    }
    return DEFAULT_MONTH_CHART;
}());
exports.DEFAULT_MONTH_CHART = DEFAULT_MONTH_CHART;
var EMPTY_BALANCE_DAY = /** @class */ (function () {
    function EMPTY_BALANCE_DAY(translatorId, clientId, dateTimeId) {
        this.dateTimeId = dateTimeId;
        this.client = { _id: clientId };
        this.translator = { _id: translatorId };
        this.statistics = {
            chats: 0,
            letters: 0,
            dating: 0,
            virtualGiftsSvadba: 0,
            virtualGiftsDating: 0,
            photoAttachments: 0,
            phoneCalls: 0,
            voiceMessages: 0,
            penalties: 0,
            comments: '',
        };
    }
    return EMPTY_BALANCE_DAY;
}());
exports.EMPTY_BALANCE_DAY = EMPTY_BALANCE_DAY;
exports.DEFAULT_ERROR = {
    status: false,
    text: null,
};
exports.DEFAULT_TRANSLATOR = {
    name: '',
    surname: '',
    suspended: {
        status: false,
        time: null,
    },
    email: null,
};
exports.SUNRISE_AGENCY_ID = '62470d5dffe20600169edac1';
exports.DEFAULT_CATEGORIES = {
    chats: 'chats',
    dating: 'dating',
    letters: 'letters',
    penalties: 'penalties',
    virtualGiftsSvadba: 'virtualGiftsSvadba',
    virtualGiftsDating: 'virtualGiftsDating',
    photoAttachments: 'photoAttachments',
    phoneCalls: 'phoneCalls',
    voiceMessages: 'voiceMessages',
};
function creatArrayOfYears() {
    var arrayWithYears = [];
    var lengthOfArrayWithYears = Number(exports.currentYear) - exports.appStartYear;
    for (var i = 0; i < lengthOfArrayWithYears + 1; i++) {
        arrayWithYears.unshift(String(exports.appStartYear + i));
    }
    return arrayWithYears;
}
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
exports.FINANCE_SENDERS = {
    anton: 'Anton',
    agency: 'Agency',
    oleksandr: 'Oleksandr',
};
exports.FINANCE_AVATARS = {
    anton: anton_avatar_png_1.default,
    oleksandr: sasha_avatar_png_1.default,
    agency: logo_png_1.default,
};
exports.FINANCE_IMAGES = {
    salary: function () { return (<MonetizationOn_1.default sx={{ fontSize: 40, color: colors_1.green[400] }}/>); },
    paymentToScout: function () { return (<CreditScore_1.default sx={{ fontSize: 40, color: colors_1.blue[500] }}/>); },
    paymentToBot: function () { return (<AdUnits_1.default sx={{ fontSize: 40, color: colors_1.purple[500] }}/>); },
    paymentToTranslator: function () { return (<FaceRetouchingNatural_1.default sx={{ fontSize: 40, color: colors_1.cyan[500] }}/>); },
};
exports.FINANCE_COMMENTS = {
    salary: 'salary',
    paymentToScout: 'Payment to scout',
    paymentToBot: 'Payment to bot',
    paymentToTranslator: 'Payment to translator',
};
exports.DEFAULT_STATEMENT = {
    receiver: '',
    amount: 0,
    sender: exports.FINANCE_SENDERS.agency,
    comment: exports.FINANCE_COMMENTS.salary,
    date: (0, moment_1.default)().utc(),
};
exports.BOT_LIST = [
    { id: 'Chat4me7210Sunrise', label: 'Chat4me' },
    { id: 'Sender7210Sunrise', label: 'Sender' },
];
exports.CHARTS_CATEGORIES = [
    {
        name: 'All',
        value: null,
        icon: <SignalCellularAlt_1.default />,
    },
    {
        name: 'Chats',
        value: 'chats',
        icon: <Chat_1.default />,
    },
    {
        name: 'Letters',
        value: 'letters',
        icon: <Email_1.default />,
    },
    {
        name: 'Dating',
        value: 'dating',
        icon: <Favorite_1.default sx={{ color: 'red' }}/>,
    },
    {
        name: 'Phone Calls',
        value: 'phoneCalls',
        icon: <PermPhoneMsg_1.default />,
    },
    {
        name: 'Virtual Gifts Svadba',
        value: 'virtualGiftsSvadba',
        icon: <CardGiftcard_1.default />,
    },
    {
        name: 'Voice Messages',
        value: 'voiceMessages',
        icon: <KeyboardVoice_1.default sx={{ color: 'red' }}/>,
    },
    {
        name: 'Attachments',
        value: 'photoAttachments',
    },
    {
        name: 'Voice Messages',
        value: 'voiceMessages',
    },
    {
        name: 'Penalties',
        value: 'penalties',
    },
];
exports.TRANSLATORS_SALARY_PERCENT = 0.45;
exports.PAYONEER_COMISSION = 0.968;
