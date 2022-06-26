const getEmailTemplateHTMLCode = ({
    arrayOfTranslatorsNamesAndMonthSums,
    monthTotalSum,
}) => {
    const translatorsSumToHtmlCode = arrayOfTranslatorsNamesAndMonthSums.map(
        translatorStrings =>
            `<tr class="translator-info-container">
                <td colspan="2"><span>${translatorStrings}</span></td>
            </tr>`
    )
    const emailTemplate = `<!DOCTYPE html>
                                    <html lang="en">
                                        <head>
                                            <meta charset="UTF-8" />
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                            <style type="text/css">
                                                table {
                                                    width: 300px;
                                                    margin: 50px auto;
                                                    min-height: 400px;
                                                    background: #f5f5f5;
                                                    border-radius: 8px;
                                                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
                                                        0 6px 6px rgba(0, 0, 0, 0.23);
                                                }
                                                thead,
                                                tbody,
                                                tr {
                                                    border: none;
                                                }
                                                .titlesInfo {
                                                    font-size: 1rem;
                                                    font-weight: bold;
                                                    background-image: linear-gradient(
                                                        to right top,
                                                        #249dc2,
                                                        #4192af,
                                                        #51869c,
                                                        #5a7b8a,
                                                        #607078
                                                    );
                                                }
                                                .titlesInfo > td {
                                                    padding: 0.5rem;
                                                }
                                    
                                                .titlesInfo > td:first-child {
                                                    border-top-left-radius: 8px;
                                                    padding: 0.5rem;
                                                }
                                                .titlesInfo > td:nth-child(2) {
                                                    border-top-right-radius: 8px;
                                                }
                                    
                                                .titlesInfo :nth-child(2) {
                                                    text-align: right;
                                                }
                                                .middleBalance {
                                                    background: linear-gradient(
                                                        to right top,
                                                        #1faee4,
                                                        #3badd7,
                                                        #50abca,
                                                        #61a9bf,
                                                        #70a7b4
                                                    );
                                                    color: white;
                                                }
                                                .numbersInfo > td {
                                                    padding: 4rem;
                                                    border-bottom: 4px solid;
                                                }
                                                .numbersInfo > td > span {
                                                    background: linear-gradient(
                                                        to right top,
                                                        #249dc2,
                                                        #4192af,
                                                        #51869c,
                                                        #5a7b8a,
                                                        #607078
                                                    );
                                                    color: white;
                                                    border-radius: 50%;
                                                    padding: 3rem;
                                                    font-size: large;
                                                    font-weight: bold;
                                                }
                                                .numbersInfo :nth-child(2) {
                                                    border-bottom: none;
                                                }
                                                .numbersInfo :nth-child(2) > span {
                                                    background: white;
                                                    color: #6c757d;
                                                    border: 1px solid #249dc2;
                                                }
                                                .translator-info-container {
                                                    text-align: left;
                                                }
                                                .translator-info-container > td {
                                                    padding: 1rem;
                                                }
                                                .expectedInfo :nth-child(2) {
                                                    color: white;
                                                }
                                            </style>
                                            <title>Agency total balance</title>
                                        </head>
                                        <body>
                                            <table cellspacing="0" cellpadding="0">
                                                <thead>
                                                    <tr class="titlesInfo">
                                                        <td>Total:</td>
                                                        <td>${monthTotalSum}$</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${translatorsSumToHtmlCode.join(
                                                        ''
                                                    )}
                                                </tbody>
                                            </table>
                                        </body>
                                    </html>
                                    `
    return emailTemplate
}

module.exports = getEmailTemplateHTMLCode
