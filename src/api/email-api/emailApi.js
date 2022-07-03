const nodeMailer = require('nodemailer')
const moment = require('moment')
const {
    calculateTranslatorYesterdayTotal,
} = require('../translatorsBalanceFunctions/translatorsBalanceFunctions')
const getAdministratorsEmailTemplateHTMLCode = require('./email-templates/getAdministratorsEmailTemplateHTMLcode')
const getTranslatorsEmailTemplateHTMLCode = require('./email-templates/getTranslatorsEmailTemplate')
const { DEFAULT_FINANCE_DAY } = require('../constants')

const sendEmailTemplateToAdministrators = translatorsCollection => {
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

    const emailHtmlTemplateForAdministrators =
        getAdministratorsEmailTemplateHTMLCode({
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
        html: emailHtmlTemplateForAdministrators,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
        console.log(`Message sent to: ${info.accepted.join(', ')}`)
    })
}

const sendEmailTemplateToTranslators = translatorsCollection => {
    let arrayOfTranslatorsInfoForEmailLetter = translatorsCollection.map(
        translator => ({
            email: translator.email,
            label: `${translator.name} ${translator.surname}`,
            id: translator._id,
            suspended: translator.suspended,
        })
    )
    arrayOfTranslatorsInfoForEmailLetter =
        arrayOfTranslatorsInfoForEmailLetter.filter(
            item => item.email && !item.suspended.status
        )

    arrayOfTranslatorsInfoForEmailLetter =
        arrayOfTranslatorsInfoForEmailLetter.map(translator => {
            const translatorsStatistics = translatorsCollection.find(
                item => item._id === translator.id
            ).statistics
            const yesterdaySum = calculateTranslatorYesterdayTotal(
                translatorsStatistics
            )
            const financeFieldList = new DEFAULT_FINANCE_DAY()
            const detailedStatistic = Object.keys(financeFieldList).map(
                fieldName => {
                    return {
                        [fieldName]: calculateTranslatorYesterdayTotal(
                            translatorsStatistics,
                            false,
                            fieldName
                        ),
                    }
                }
            )
            return { ...translator, yesterdaySum, detailedStatistic }
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
    console.log(
        JSON.stringify(arrayOfTranslatorsInfoForEmailLetter, undefined, 2)
    )

    arrayOfTranslatorsInfoForEmailLetter.forEach(translator => {
        const emailHtmlTemplateForTranslators =
            getTranslatorsEmailTemplateHTMLCode(translator)
        let mailOptions = {
            from: '"Sunrise agency" <antonstilet@gmail.com>',
            to: translator.email,
            subject: "Your yesterday's balance",
            text: `Statistics for ${moment()
                .subtract(1, 'day')
                .format('MMMM DD, YYYY')}`,
            html: emailHtmlTemplateForTranslators,
            attachments: [
                {
                    filename: 'mail-icon.png',
                    path: './src/images/mail-icon.png',
                    cid: 'mailIcon',
                },
            ],
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error)
            }
            console.log(`Message sent to: ${info.accepted.join(', ')}`)
        })
    })
}
module.exports = {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
}
