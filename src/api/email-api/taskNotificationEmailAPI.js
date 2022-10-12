const moment = require('moment')
const nodeMailer = require('nodemailer')
const {
    getNotificationsEmailTemplateHTMLCode,
} = require('./email-templates/getNotificationsEmailTemplateHTMLCode')
const { administratorsEmailList } = require('../constants')
const sendTaskNotificationEmailTemplatesToAdministrators = taskCollection => {
    try {
        const uncompletedTasksWithStartedWeekAgoOrMore = taskCollection.filter(
            task => {
                const taskWasCreatedMoreThanWeekAgo = moment(
                    task.created,
                    'MMMM Do YYYY, h:mm:ss'
                ).isBefore(moment().subtract(7, 'days'))
                return !task.completed && taskWasCreatedMoreThanWeekAgo
            }
        )

        if (uncompletedTasksWithStartedWeekAgoOrMore?.length > 0) {
            console.log('todo: create and send email')
            const notificationsEmailTemplateHTMLCode =
                getNotificationsEmailTemplateHTMLCode(
                    uncompletedTasksWithStartedWeekAgoOrMore
                )
            let transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'antonstilet@gmail.com',
                    pass: 'vsurysphowtyqljr',
                },
            })
            const administratorsEmailListWithoutVasyl = [
                ...administratorsEmailList,
            ].pop()
            let mailOptions = {
                from: '"Sunrise agency" <sunrise-agency@gmail.com>',
                to: administratorsEmailListWithoutVasyl,
                subject: `Date: ${moment()
                    .subtract(1, 'day')
                    .format('MMMM DD, YYYY')}`,
                text: `List of uncompleted tasks`,
                html: notificationsEmailTemplateHTMLCode,
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    throw new Error(error)
                }
                console.log(`Message sent to: ${info.accepted.join(', ')}`)
            })
            return true
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    sendTaskNotificationEmailTemplatesToAdministrators,
}