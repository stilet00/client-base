const moment = require('moment')
const getTranslatorsEmailTemplateHTMLCode = translatorInfoForEmailLetter => {
    const arrayOfDetailedBalanceFields =
        translatorInfoForEmailLetter.detailedStatistic.map(
            (statisticsInfoForClient, index) => {
                const amountsForStatisticCategories =
                    statisticsInfoForClient.statistics.map(
                        statisticsCategory => {
                            if (
                                Object.keys(statisticsCategory).includes(
                                    'photoAttachments'
                                )
                            ) {
                                return ''
                            } else {
                                return `<td class="container__tbody_amount">${Object.values(
                                    statisticsCategory
                                ).join('')}</td>`
                            }
                        }
                    )
                return `<tr class="${
                    index % 2 ? 'container__tbody_secondTR' : ''
                }">
                    <td class="container__tbody_client">
                        ${statisticsInfoForClient.name}
                    </td>
                    ${amountsForStatisticCategories.join('')}
                </tr> `
            }
        )
    const emailTemplate = `<!DOCTYPE html>
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8" />
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <style type="text/css">
                                            h2 {
                                                margin: 0;
                                            }
                                            .wrapper {
                                                width: 100%;
                                                background: rgb(209,228,237);
                                                margin: 0 auto;
                                                border-collapse: collapse;
                                            }
                                            .container {
                                                margin: 0 auto;
                                                width: 90%;
                                                max-width: 500px;
                                                padding: 1rem;
                                                text-align: center;
                                                background-color: #ffffff;
                                                border-collapse: collapse;
                                                border-radius: 8px;
                                                color: #564f4f;
                                                font-family: 'Kantumruy Pro', sans-serif;
                                            }
                                            tr, td {
                                                padding: 0.5rem;
                                            }
                                            .container__tableheader {
                                                background: rgb(95,205,181);
                                                padding: 10px 0 0 0;
                                                border-radius: 8px 8px 0 0;
                                            }
                                            .container__tableheader-greetingsinfo {
                                                background: rgb(95,205,181);
                                                color: white
                                            }
                                            .container__tbody-header {
                                                font-weight: bold;
                                                vertical-align: bottom;
                                            }
                                            .container__tbody-main {
                                                background: rgb(95,205,181);
                                                font-weight: bold
                                            }
                                            .container__tbody-header-first-td {
                                                width: 15%
                                            }
                                            .container__tbody_secondTR {
                                                background: #fcfcfc;
                                                border-top: 1px solid #afa5a5;
                                                border-bottom: 1px solid #afa5a5;
                                            }
                                            .container__tbody_client {
                                                font-family: sans-serif;
                                                font-weight: 400;
                                                text-align: left;
                                            }
                                            .container__tbody_amount {
                                                font-style: italic;
                                                text-align: center;
                                                font-weight: bold;
                                            }
                                            .container__tfoot-td {
                                                text-align: end;
                                                font-weight: bold;
                                                border-top: 4px solid rgb(95,205,181);
                                                vertical-align: bottom;
                                            }
                                            .icons {
                                                width: 2rem;
                                                height: 2rem;
                                            }    
        
                                    </style>
                                    <title>Email from Sunrise</title>
                                </head>
                                <body>
                                    <table class="wrapper">
                                        <tr>
                                            <td>
                                                <table class="container">
                                                    <thead>
                                                    <tr>
                                                        <td  class="container__tableheader" colspan="9">
                                                            <img src="cid:email-icon" alt="placeholder"></img>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="container__tableheader-greetingsinfo"  colspan="9">
                                                                <h2>
                                                                    Hello ${
                                                                        translatorInfoForEmailLetter.label.split(
                                                                            ' '
                                                                        )[0]
                                                                    }, here is your balance:
                                                                </h2>
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr class="container__tbody-main">
                                                        <td class="container__tbody-header-first-td">
                                                            <img src="cid:women" alt="Client name"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:chat" class="icons" alt="Chats"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:email-letter" class="icons"  alt="Letters"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:love"class="icons" alt="Dating"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:gift" class="icons" alt="Virtual gifts on Svadba"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:heart" alt="virtual gifts Dating" class="icons" alt="Virtual gifts on Dating"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:telephone" class="icons"  alt="Phone calls"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:penalties" class="icons"  alt="Penalties"></img>
                                                        </td>
                                                    </tr>
                                                    ${arrayOfDetailedBalanceFields.join(
                                                        ''
                                                    )}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td class="container__tfoot-td" colspan="3">
                                                            Yesterday: ${
                                                                translatorInfoForEmailLetter.yesterdaySum
                                                            } <img src="cid:dollar-sign" alt="$" style="vertical-align: inherit"></img>
                                                        </td>
                                                        <td class="container__tfoot-td" colspan="5">
                                                            ${moment().format(
                                                                'MMMM'
                                                            )}: ${
        translatorInfoForEmailLetter.currentMonthTotal
    } <img src="cid:dollar-sign" alt="$" style="vertical-align: inherit"></img>
                                                            <span style="color:${
                                                                translatorInfoForEmailLetter
                                                                    .monthProgressPercent
                                                                    .progressIsPositive
                                                                    ? 'green'
                                                                    : 'red'
                                                            }">${
        translatorInfoForEmailLetter.monthProgressPercent.progressIsPositive
            ? '+'
            : '-'
    }${translatorInfoForEmailLetter.monthProgressPercent.value}%</span>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr align="center">
                                            <td>Thank you for all your hard work.</td>
                                        </tr>
                                    </table>
                                </body>
                            </html>
                            `
    return emailTemplate
}

module.exports = getTranslatorsEmailTemplateHTMLCode
