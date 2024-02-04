const moment = require('moment')
const getTranslatorsEmailTemplateHTMLCode = translatorInfoForEmailLetter => {
    const arrayOfDetailedBalanceFields =
        translatorInfoForEmailLetter.detailedStatistic.map(
            (statisticsInfoForClient, index) => {
                const amountsForStatisticCategories =
                    statisticsInfoForClient.statistics.map(
                        statisticsCategory => {
                            return `<td class="container__tbody_amount">${Object.values(
                                statisticsCategory
                            ).join('')}</td>`
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
                                    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
                                    <style type="text/css">
                                            h2 {
                                                margin: 0;
                                            }
                                            body {
                                                font-family: 'Roboto', sans-serif;
                                              }
                                            .wrapper {
                                                width: 100%;
                                                background: #dddddd;
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
                                                border-radius: 4px;
                                                box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2), 5px 5px 5px #abc6f7;
                                            }
                                            tr, td {
                                                padding: 0.5rem;
                                                font-family: 'Roboto', sans-serif;
                                                color: #6a6666;
                                            }
                                            .container__tableheader {
                                                background: #005BBB;
                                               
                                                padding: 10px 0 0 0;
                                                border-radius: 4px 4px 0 0;
                                            }
                                            .container__tableheader-greetingsinfo {
                                                background: linear-gradient(to bottom, #005BBB, #FFD100);
                                                color: #ffffff;
                                            }
                                            .container__tbody-header {
                                                font-weight: bold;
                                                vertical-align: bottom;
                                            }
                                            .container__tbody-main {
                                                background: #FFD100;
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
                                                border-top: 3px solid #005BBB;
                                                vertical-align: bottom;
                                            }
                                            .shadow-img {
                                                width: 32px;
                                                height: 32px;
                                                border: solid 1px #c0c0c08f;
                                                background-color: #eed;
                                                box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
                                                -moz-box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
                                                -webkit-box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
                                                -o-box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
                                                border-radius:100px;
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
                                                        <td  class="container__tableheader" colspan="10">
                                                            <img src="cid:email-icon" alt="placeholder"></img>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="container__tableheader-greetingsinfo"  colspan="10">
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
                                                            <img src="cid:customer" width="32" height="32" alt="Client name" class="shadow-img"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:chat" width="32" height="32" alt="Chats" class="shadow-img"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:email-letter" width="32" height="32"  alt="Letters" class="shadow-img"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:love" width="32" height="32" alt="Dating" class="shadow-img"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:gift" width="32" height="32" alt="Virtual gifts on Svadba" class="shadow-img"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:heart" alt="virtual gifts Dating" width="32" height="32"  alt="Virtual gifts on Dating" class="shadow-img"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:attachments" width="32" height="32"  alt="Attachments" class="shadow-img"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:telephone" width="32" height="32"  alt="Phone calls" class="shadow-img"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:voice" width="32" height="32"  alt="Voice messages" class="shadow-img"></img>
                                                        </td>
                                                        <td class="container__tbody_amount">
                                                            <img src="cid:penalties"  width="32" height="32"   alt="Penalties" class="shadow-img"></img>
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
                                                                translatorInfoForEmailLetter.yesterdayTotal
                                                            } <img src="cid:dollar-sign" width="16" height="16" alt="dollar" style="vertical-align: sub"></img>
                                                        </td>
                                                        <td class="container__tfoot-td" colspan="4">
                                                            ${moment().format(
                                                                'MMMM'
                                                            )}: ${
        translatorInfoForEmailLetter.currentMonthTotal
    } <img src="cid:dollar-sign" width="16" height="16"  alt="dollar" style="vertical-align: sub"></img> <span style="color:${
        translatorInfoForEmailLetter.monthProgressPercent.progressIsPositive
            ? 'green'
            : 'red'
    }">${
        translatorInfoForEmailLetter.monthProgressPercent.progressIsPositive
            ? '+'
            : '-'
    }${translatorInfoForEmailLetter.monthProgressPercent.value}%</span>
                                                        </td>
                                                        <td class="container__tfoot-td" colspan="3">
                                                            Penalties: <span>🛑 </span><span style="color:${
                                                                translatorInfoForEmailLetter.curMonthPenalties >
                                                                0
                                                                    ? 'red'
                                                                    : 'green'
                                                            }">${
        translatorInfoForEmailLetter.curMonthPenalties
    }$</span>
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
