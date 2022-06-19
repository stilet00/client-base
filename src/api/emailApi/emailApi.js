const nodeMailer = require('nodemailer')
const moment = require('moment')
const calculateTranslatorYesterdayTotal = require('../translatorsBalanceFunctions/translatorsBalanceFunctions')

const sendEmailTemplateToTranslators = translatorsCollection => {
    const translatorsTotalDataArray = []
    translatorsCollection.forEach(translator => {
        const translatorDataLabel = `${translator.name} ${
            translator.surname
        } total: ${calculateTranslatorYesterdayTotal(translator)}$`
        if (calculateTranslatorYesterdayTotal(translator)) {
            translatorsTotalDataArray.push(translatorDataLabel)
        }
        console.log(translatorsTotalDataArray)
    })
    let htmlContent = '<div>'
    translatorsTotalDataArray.forEach(item => {
        htmlContent = htmlContent + `<p>${item}</p>`
    })
    htmlContent += '</div>'
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'antonstilet@gmail.com',
            pass: 'vsurysphowtyqljr',
        },
    })
    let mailOptions = {
        from: '"Sunrise agency" <antonstilet@gmail.com>',
        to: 'safroninanton@gmail.com',
        subject: `Sunrise agency statistics test every 5 minutes: ${moment().format(
            'MMMM DD, YYYY'
        )}`,
        text: 'From our server',
        html: htmlContent,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message %s sent: %s', info.messageId, info.response)
        // res.render('index')
    })
}
module.exports = sendEmailTemplateToTranslators
