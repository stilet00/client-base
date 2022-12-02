import moment from 'moment'
import {
    getStringMonthNumber,
    getTotalDaysOfMonth,
} from '../sharedFunctions/sharedFunctions'
import background1 from '../images/tasks_backgrounds/background1.png'
import background2 from '../images/tasks_backgrounds/background2.png'
import background3 from '../images/tasks_backgrounds/background3.png'
import background4 from '../images/tasks_backgrounds/background4.png'
import background5 from '../images/tasks_backgrounds/background5.png'
import background6 from '../images/tasks_backgrounds/background6.png'
import background7 from '../images/tasks_backgrounds/background7.png'
import background8 from '../images/tasks_backgrounds/background8.png'
import background9 from '../images/tasks_backgrounds/background9.png'
import background10 from '../images/tasks_backgrounds/background10.png'
import Agency_avatar from '../images/logo.png'
import Anton_avatar from '../images/avatars/anton-avatar.png'
import Oleksandr_avatar from '../images/avatars/sasha-avatar.png'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import AdUnitsIcon from '@mui/icons-material/AdUnits'
import { purple, blue, green } from '@mui/material/colors'

export const currentYear = moment().format('YYYY')
export const previousYear = moment().subtract(1, 'year').format('YYYY')
export const currentMonth = moment().format('M')
export const previousMonth = moment().subtract(1, 'month').format('M')
export const previousDay = moment().subtract(1, 'day').format('D')

export const DEFAULT_CLIENT = {
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
}

export const DEFAULT_PENALTY = {
    date: moment().format('DD MM YYYY'),
    amount: 0,
    description: '',
}

class DEFAULT_DAY_BALANCE {
    constructor(year, month, day) {
        this.id = moment(year + month + day, 'YYYYMMDD').format('DD MM YYYY')
        this.clients = []
    }
}

export class DEFAULT_MONTH_CHART {
    constructor(year, month) {
        this.year = year
        this.month = getStringMonthNumber(month)
        this.days = getTotalDaysOfMonth(year, month)
        this.values = []
    }
}

export class DEFAULT_DAY_CLIENT {
    constructor(clientId) {
        this.id = clientId
        this.chats = 0
        this.letters = 0
        this.dating = 0
        this.virtualGiftsSvadba = 0
        this.virtualGiftsDating = 0
        this.photoAttachments = 0
        this.phoneCalls = 0
        this.penalties = 0
        this.comments = ''
    }
}

export const DEFAULT_BALANCE_DATA = [
    {
        year: currentYear,
        months: fillMonths(currentYear),
    },
]

export const DEFAULT_TRANSLATOR = {
    name: '',
    surname: '',
    clients: [],
    statistics: DEFAULT_BALANCE_DATA,
    suspended: {
        status: false,
        time: null,
    },
    personalPenalties: [],
    email: null,
}

export const SUNRISE_TRANSLATOR_ID = '62470d5dffe20600169edac1'

export const DEFAULT_CATEGORIES = {
    chats: 'chats',
    dating: 'dating',
    letters: 'letters',
    penalties: 'penalties',
    virtualGiftsSvadba: 'virtualGiftsSvadba',
    virtualGiftsDating: 'virtualGiftsDating',
    photoAttachments: 'photoAttachments',
    phoneCalls: 'phoneCalls',
}

function fillMonths(year) {
    let monthArray = []
    for (let i = 1; i < 13; i++) {
        let month = fillDays(i, year)
        monthArray.push(month)
    }
    return monthArray
}

function fillDays(month, year) {
    const stringMonth = month < 10 ? '0' + month : month
    let totalDays = []
    for (
        let i = 1;
        i <= moment(year + '-' + stringMonth, 'YYYY-MM').daysInMonth();
        i++
    ) {
        let data = new DEFAULT_DAY_BALANCE(year, stringMonth, i)
        totalDays.push(data)
    }
    return totalDays
}
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
]

export const FINANCE_SENDERS = {
    anton: 'Anton',
    agency: 'Agency',
    oleksandr: 'Oleksandr',
}
export const FINANCE_AVATARS = {
    anton: Anton_avatar,
    oleksandr: Oleksandr_avatar,
    agency: Agency_avatar,
}
export const FINANCE_IMAGES = {
    salary: <MonetizationOnIcon sx={{ fontSize: 40, color: green[400] }} />,
    paymentToScout: <CreditScoreIcon sx={{ fontSize: 40, color: blue[500] }} />,
    paymentToBot: <AdUnitsIcon sx={{ fontSize: 40, color: purple[500] }} />,
}
export const FINANCE_COMMENTS = {
    salary: 'salary',
    paymentToScout: 'Payment to scout',
    paymentToBot: 'Payment to bot',
}
export const DEFAULT_STATEMENT = {
    receiver: '',
    amount: 0,
    sender: FINANCE_SENDERS.agency,
    comment: FINANCE_COMMENTS.salary,
    date: moment(),
}
export const BOT_LIST = ['Chat4me', 'Sender']

export const TRANSLATORS_SALARY_PERCENT = 0.45

export const PAYONEER_COMISSION = 0.04