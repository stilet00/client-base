import moment from 'moment'
import {
    getStringMonthNumber,
    getTotalDaysOfMonth,
} from '../sharedFunctions/sharedFunctions'
import image1 from '../images/tasks_backgrounds/image1-min.png'
import image2 from '../images/tasks_backgrounds/image2-min.png'
import image3 from '../images/tasks_backgrounds/image3-min.png'
import image4 from '../images/tasks_backgrounds/image4-min.png'
import image5 from '../images/tasks_backgrounds/image5-min.png'
import image6 from '../images/tasks_backgrounds/image6-min.png'
import image7 from '../images/tasks_backgrounds/image7-min.png'
import image8 from '../images/tasks_backgrounds/image8-min.png'
import image9 from '../images/tasks_backgrounds/image9-min.png'
import image10 from '../images/tasks_backgrounds/image10-min.png'

export const currentYear = moment().format('YYYY')
export const previousYear = moment().subtract(1, 'year').format('YYYY')
export const currentMonth = moment().format('M')
export const previousMonth = moment().subtract(1, 'month').format('M')
export const previousDay = moment().subtract(1, 'day').format('D')

export const DEFAULT_CLIENT = {
    name: '',
    surname: '',
    translators: [],
    suspended: false,
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
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
]