const nodeMailer = require('nodemailer')
const moment = require('moment')
const {
    calculateTranslatorYesterdayTotal,
} = require('../translatorsBalanceFunctions/translatorsBalanceFunctions')
const getAdministratorsEmailTemplateHTMLCode = require('./email-template/getAdministratorsEmailTemplateHTMLcode')

const sendEmailTemplateToTranslators = translatorsCollection => {
    const arrayOfTranslatorsNamesAndMonthSums = translatorsCollection
        .map(({ name, surname, statistics }) => {
            const translatorSum = calculateTranslatorYesterdayTotal(statistics)
            return translatorSum
                ? `${name} ${surname}: <b>${translatorSum} $</b>`
                : null
        })
        .filter(notEmptyString => notEmptyString)

    const yesterdayTotalSum = translatorsCollection
        .map(({ statistics }) => {
            return Number(calculateTranslatorYesterdayTotal(statistics))
        })
        .reduce((sum, current) => sum + current, 0)
        .toFixed(2)

    const emailHtmlTemplate = getAdministratorsEmailTemplateHTMLCode({
        arrayOfTranslatorsNamesAndMonthSums,
        yesterdayTotalSum,
    })
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'antonstilet@gmail.com',
            pass: 'vsurysphowtyqljr',
        },
    })
    const emailList = [
        'antonstilet@gmail.com',
        // 'safroninanton@gmail.com',
        // 'vasiliybabchenkov@gmail.com',
    ]
    let mailOptions = {
        from: '"Sunrise agency" <antonstilet@gmail.com>',
        to: emailList,
        subject: `Statistics for ${moment()
            .subtract(1, 'day')
            .format('MMMM DD, YYYY')}`,
        text: 'From our server',
        html: emailHtmlTemplate,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
        console.log(`Message sent to: ${info.accepted.join(', ')}`)
    })
}
module.exports = sendEmailTemplateToTranslators
