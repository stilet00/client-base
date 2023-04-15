const nodeMailer = require('nodemailer')
const moment = require('moment')
const {
    calculateTranslatorYesterdayTotal,
    calculateTranslatorMonthTotal,
    calculatePercentDifference,
} = require('../translatorsBalanceFunctions/translatorsBalanceFunctions')
const getAdministratorsEmailTemplateHTMLCode = require('./email-templates/getAdministratorsEmailTemplateHTMLcode')
const getTranslatorsEmailTemplateHTMLCode = require('./email-templates/getTranslatorsEmailTemplate')
const { DEFAULT_FINANCE_DAY, administratorsEmailList } = require('../constants')
var path = require('path')
class imageAttachmentInformation {
    constructor(imageName) {
        this.filename = imageName
        this.path = path.join(__dirname, 'email-images', imageName)
        this.cid = imageName.replace('.png', '')
    }
}
const credentialsForNodeMailer = JSON.parse(
    process.env.CREDENTIALS_FOR_NODEMAILER
)
const imageNamesArrayForEmail = [
    'email-icon.png',
    'women.png',
    'chat.png',
    'love.png',
    'email-letter.png',
    'telephone.png',
    'gift.png',
    'heart.png',
    'dollar-sign.png',
    'penalties.png',
]

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
            user: credentialsForNodeMailer.user,
            pass: credentialsForNodeMailer.pass,
        },
    })
    let mailOptions = {
        from: '"Sunrise agency" <sunrise-agency@gmail.com>',
        to: administratorsEmailList,
        subject: `Date: ${moment().subtract(1, 'day').format('MMMM DD, YYYY')}`,
        text: `Balance: ${yesterdayTotalSum}$`,
        html: emailHtmlTemplateForAdministrators,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new Error(error)
        }
        console.log(`Message sent to: ${info.accepted.join(', ')}`)
    })
}

const sendEmailTemplateToTranslators = async translatorsCollection => {
    let arrayOfTranslatorsInfoForEmailLetter = translatorsCollection.map(
        translator => ({
            email: translator.email,
            label: `${translator.name} ${translator.surname}`,
            id: translator._id,
            suspended: translator.suspended,
            activeClients: translator.clients.filter(
                client => !client.suspended
            ),
            wantsToReceiveEmails: translator.wantsToReceiveEmails,
        })
    )
    arrayOfTranslatorsInfoForEmailLetter =
        arrayOfTranslatorsInfoForEmailLetter.filter(
            item =>
                item.email &&
                !item.suspended.status &&
                item.wantsToReceiveEmails
        )

    arrayOfTranslatorsInfoForEmailLetter =
        arrayOfTranslatorsInfoForEmailLetter.map(translator => {
            const translatorsStatistics = translatorsCollection.find(
                item => item._id === translator.id
            ).statistics
            const yesterdaySum = calculateTranslatorYesterdayTotal(
                translatorsStatistics
            )
            const currentMonthTotal = calculateTranslatorMonthTotal(
                translatorsStatistics
            )
            const previousMonthTotal = calculateTranslatorMonthTotal(
                translatorsStatistics,
                false,
                moment().subtract(1, 'month').format('MM')
            )
            const monthProgressPercent = calculatePercentDifference(
                currentMonthTotal,
                previousMonthTotal
            )
            const financeFieldList = new DEFAULT_FINANCE_DAY()
            const detailedStatistic = translator.activeClients.map(client => {
                const statisticByClient = Object.keys(financeFieldList).map(
                    fieldName => {
                        return {
                            [fieldName]: calculateTranslatorYesterdayTotal(
                                translatorsStatistics,
                                false,
                                fieldName,
                                client._id
                            ),
                        }
                    }
                )
                return {
                    name: `${client.name} ${client.surname}`,
                    statistics: statisticByClient,
                }
            })

            return {
                ...translator,
                yesterdaySum,
                currentMonthTotal,
                monthProgressPercent,
                detailedStatistic,
            }
        })

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: credentialsForNodeMailer.user,
            pass: credentialsForNodeMailer.pass,
        },
    })

    const arrayOfTranslatorsWhoReceivedLetter = await Promise.all(
        arrayOfTranslatorsInfoForEmailLetter.map(
            async (translatorInfoForEmailLetter, index) => {
                const emailHtmlTemplateForTranslators =
                    getTranslatorsEmailTemplateHTMLCode(
                        translatorInfoForEmailLetter
                    )
                const imagesPathArrayForEmail = imageNamesArrayForEmail.map(
                    imageName => {
                        const imageInfoObject = new imageAttachmentInformation(
                            imageName
                        )
                        return imageInfoObject
                    }
                )
                let mailOptions = {
                    from: '"Sunrise agency" <sunrise-agency@gmail.com>',
                    to: translatorInfoForEmailLetter.email,
                    subject: `Date: ${moment()
                        .subtract(1, 'day')
                        .format('MMMM DD, YYYY')}`,
                    text: `Balance: ${translatorInfoForEmailLetter.yesterdaySum}$`,
                    html: emailHtmlTemplateForTranslators,
                    attachments: imagesPathArrayForEmail,
                }
                setTimeout(() => {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            throw new Error(error)
                        }
                        console.log(
                            `Message sent to: ${info.accepted.join(', ')}`
                        )
                    })
                }, index * 5000)
                return translatorInfoForEmailLetter.label
            }
        )
    )
    return arrayOfTranslatorsWhoReceivedLetter
}
module.exports = {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
}
