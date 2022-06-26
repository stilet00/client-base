const nodeMailer = require('nodemailer')
const moment = require('moment')
const calculateTranslatorMonthTotal = require('../translatorsBalanceFunctions/translatorsBalanceFunctions')
const getEmailTemplateHTMLCode = require('../email-api/email-template/getEmailTemplateHTMLcode')

const sendEmailTemplateToTranslators = translatorsCollection => {
    const arrayOfTranslatorsNamesAndMonthSums = translatorsCollection
        .map(({ name, surname, statistics }) => {
            const translatorSum = calculateTranslatorMonthTotal(statistics)
            return translatorSum
                ? `${name} ${surname}: ${translatorSum}$`
                : null
        })
        .filter(notEmptyString => notEmptyString)
    const monthTotalSum = translatorsCollection.reduce(
        (sum, { statistics }) => {
            return sum + Number(calculateTranslatorMonthTotal(statistics))
        },
        0
    )
    const emailHtmlTemplate = getEmailTemplateHTMLCode({
        arrayOfTranslatorsNamesAndMonthSums,
        monthTotalSum,
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
        'safroninanton@gmail.com',
        'vasiliybabchenkov@gmail.com',
    ]
    let mailOptions = {
        from: '"Sunrise agency" <antonstilet@gmail.com>',
        to: emailList,
        subject: `Sunrise agency statistics total by ${moment().format(
            'MMMM DD, YYYY'
        )}`,
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
