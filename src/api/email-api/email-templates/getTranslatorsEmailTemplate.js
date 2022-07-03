const getTranslatorsEmailTemplateHTMLCode = translator => {
    const emailTemplate = `<!DOCTYPE html>
                                <html lang="en">
                                    <head>
                                        <meta charset="UTF-8" />
                                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                                        <link
                                            href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600&display=swap"
                                            rel="stylesheet"
                                        />
                                        <style type="text/css">
                                            .email-container {
                                                width: 100%;
                                                height: 100%;
                                                position: relative;
                                                background: rgb(202, 229, 235);
                                                clip-path: polygon(0% 10%, 100% 0, 100% 90%, 0 100%);
                                                overflow: hidden;
                                            }
                                
                                            .email-container__card {
                                                width: 400px;
                                                margin: 50px auto;
                                                border-radius: 5px;
                                                background: #fcfcfc;
                                                border-collapse: collapse;
                                                font-family: 'Kantumruy Pro', sans-serif;
                                            }
                                
                                            .email-container__card__header {
                                                background: rgb(121, 189, 203);
                                                border-radius: 5px;
                                                text-align: center;
                                                font-size: 20px;
                                                color: #ffffff;
                                            }
                                
                                            .email-container__card__header-cell-one {
                                                border-top-left-radius: 5px;
                                                border-top-right-radius: 5px;
                                                padding: 20px 10px 0 10px;
                                            }
                                
                                            .email-container__card__header-cell-two {
                                                padding: 0 10px 20px 10px;
                                            }
                                
                                            .email-container__card__body--total {
                                                text-align: center;
                                                height: 30px;
                                                font-size: 15px;
                                            }
                                
                                            .email-container__card__body--total-cell-one {
                                                color: #727070;
                                                padding: 10px 0;
                                                border-bottom: 1px solid #727070;
                                            }
                                
                                            .email-container__card__body--total-cell-one__line {
                                                display: block;
                                                width: 100%;
                                                margin-top: 5px;
                                            }
                                
                                            .email-container__card__body--detailed-note {
                                                padding: 10px 20px 0 20px;
                                                color: #727070;
                                                font-size: 10px;
                                            }
                                
                                            .email-container__card__body--detailed-header {
                                                padding: 10px 20px 0 20px;
                                                font-weight: 400;
                                            }
                                
                                            .email-container__card__body--detailed-amount {
                                                padding: 10px 20px 0 20px;
                                                font-weight: 600;
                                            }
                                
                                            .email-container__card__body--detailed--last-child {
                                                padding-bottom: 20px;
                                            }
                                        </style>
                                        <title>Document</title>
                                    </head>
                                    <body>
                                        <table class="email-container">
                                            <tr>
                                                <td colspan="2">
                                                    <table class="email-container__card">
                                                        <thead class="email-container__card__header">
                                                            <tr>
                                                                <td
                                                                    colspan="2"
                                                                    class="email-container__card__header-cell-one"
                                                                >
                                                                    <img
                                                                        src="cid:mailIcon"
                                                                        width="50px"
                                                                        height="50px"
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    colspan="2"
                                                                    class="email-container__card__header-cell-two"
                                                                >
                                                                    Hello Antonina! Here is your statistics up
                                                                    to July 1, 2022
                                                                </td>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="email-container__card__body">
                                                            <tr class="email-container__card__body--total">
                                                                <td
                                                                    colspan="2"
                                                                    class="email-container__card__body--total-cell-one"
                                                                >
                                                                    Total for yesterday: <strong>100 $</strong>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    colspan="2"
                                                                    class="email-container__card__body--detailed-note"
                                                                >
                                                                    More detailed balance:
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    class="email-container__card__body--detailed-header"
                                                                >
                                                                    Chats & letters
                                                                </td>
                                                                <td
                                                                    class="email-container__card__body--detailed-amount"
                                                                >
                                                                    20$
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    class="email-container__card__body--detailed-header"
                                                                >
                                                                    Phone calls
                                                                </td>
                                                                <td
                                                                    class="email-container__card__body--detailed-amount"
                                                                >
                                                                    30$
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    class="email-container__card__body--detailed-header"
                                                                >
                                                                    Virtual gifts
                                                                </td>
                                                                <td
                                                                    class="email-container__card__body--detailed-amount"
                                                                >
                                                                    10$
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    class="email-container__card__body--detailed-header email-container__card__body--detailed--last-child"
                                                                >
                                                                    Chats & letters
                                                                </td>
                                                                <td
                                                                    class="email-container__card__body--detailed-amount email-container__card__body--detailed--last-child"
                                                                >
                                                                    20$
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </body>
                                </html>
                            `
    return emailTemplate
}

module.exports = getTranslatorsEmailTemplateHTMLCode
