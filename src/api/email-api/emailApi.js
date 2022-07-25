const nodeMailer = require('nodemailer')
const moment = require('moment')
const {
    calculateTranslatorYesterdayTotal,
} = require('../translatorsBalanceFunctions/translatorsBalanceFunctions')
const getAdministratorsEmailTemplateHTMLCode = require('./email-templates/getAdministratorsEmailTemplateHTMLcode')
const getTranslatorsEmailTemplateHTMLCode = require('./email-templates/getTranslatorsEmailTemplate')
const { DEFAULT_FINANCE_DAY, administratorsEmailList } = require('../constants')

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
    let mailOptions = {
        from: '"Sunrise agency" <sunrise-agency@gmail.com>',
        to: administratorsEmailList,
        subject: `Date: ${moment().subtract(1, 'day').format('MMMM DD, YYYY')}`,
        text: `Balance: ${yesterdayTotalSum}$`,
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
            label: translator.name,
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

    arrayOfTranslatorsInfoForEmailLetter.forEach(
        translatorInfoForEmailLetter => {
            const emailHtmlTemplateForTranslators =
                getTranslatorsEmailTemplateHTMLCode(
                    translatorInfoForEmailLetter
                )
            let mailOptions = {
                from: '"Sunrise agency" <sunrise-agency@gmail.com>',
                to: translatorInfoForEmailLetter.email,
                subject: `Date: ${moment()
                    .subtract(1, 'day')
                    .format('MMMM DD, YYYY')}`,
                text: `Balance: ${translatorInfoForEmailLetter.yesterdaySum}$`,
                html: emailHtmlTemplateForTranslators,
                attachments: [
                    {
                        filename: 'mail-icon.png',
                        path: './src/images/email-images/email-icon.png',
                        cid: 'emailIcon',
                    },
                    {
                        filename: 'women.png',
                        path: './src/images/email-images/women.png',
                        cid: 'women',
                    },
                    {
                        filename: 'chat.png',
                        path: './src/images/email-images/chat.png',
                        cid: 'chat',
                    },
                    {
                        filename: 'love.png',
                        path: './src/images/email-images/love.png',
                        cid: 'love',
                    },
                    {
                        filename: 'email-letter.png',
                        path: './src/images/email-images/email-letter.png',
                        cid: 'email-letter',
                    },
                    {
                        filename: 'telephone.png',
                        path: './src/images/email-images/telephone.png',
                        cid: 'telephone',
                    },
                    {
                        filename: 'gift.png',
                        path: './src/images/email-images/gift.png',
                        cid: 'gift',
                    },
                    {
                        filename: 'heart.png',
                        path: './src/images/email-images/heart.png',
                        cid: 'heart',
                    },
                    {
                        filename: 'dollar-sign.png',
                        path: './src/images/email-images/dollar-sign.png',
                        cid: 'dollar-sign',
                    },
                    {
                        filename: 'photoAttachments.png',
                        path: './src/images/email-images/photoAttachments.png',
                        cid: 'photoAttachments',
                    },
                    {
                        filename: 'penalties.png',
                        path: './src/images/email-images/penalties.png',
                        cid: 'penalties',
                    },
                ],
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error)
                }
                console.log(`Message sent to: ${info.accepted.join(', ')}`)
            })
        }
    )
}
module.exports = {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
}
