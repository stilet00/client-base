const getAdministratorsEmailTemplateHTMLCode = ({
	arrayOfTranslatorsNamesAndMonthSums,
	yesterdayTotalSum,
}) => {
	const lengthOfHalfNamesAndMonthsSumsArray = Math.round(
		arrayOfTranslatorsNamesAndMonthSums.length / 2,
	);
	const firstRowOfSumsAndNames = arrayOfTranslatorsNamesAndMonthSums.slice(
		0,
		lengthOfHalfNamesAndMonthsSumsArray,
	);
	const secondRowOfSumsAndNames = arrayOfTranslatorsNamesAndMonthSums.slice(
		lengthOfHalfNamesAndMonthsSumsArray,
	);
	const translatorsSumToHtmlCode = firstRowOfSumsAndNames.map(
		(translatorStrings, index) =>
			`<tr class="translator-info-container">
                <td><span>${translatorStrings}</span></td>
                <td><span>${
									secondRowOfSumsAndNames[index]
										? secondRowOfSumsAndNames[index]
										: ""
								}</span></td>
            </tr>`,
	);
	const emailTemplate = `<!DOCTYPE html>
                                    <html lang="en">
                                        <head>
                                            <meta charset="UTF-8" />
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                            <style type="text/css">
                                                table {
                                                    width: 450px;
                                                    margin: 50px auto;
                                                    min-height: 400px;
                                                    background: linear-gradient(0deg, rgba(2,0,36,0.2) 0%, rgba(182,254,255,0.2) 0%, rgba(0,212,255,0.2) 100%);
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
                                                    border-radius: 8px;
                                                }
                                                .titlesInfo > td {
                                                    padding: 1rem;
                                                }
                                                .title-info {
                                                    border-top-left-radius: 8px;
                                                    border-top-right-radius: 8px;
                                                }

                                                .titlesInfo > td:first-child {
                                                    border-top-left-radius: 8px;
                                                    padding: 1rem;
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
                                                .translator-info-title {
                                                    text-align: center;
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
                                            <title>Agency total balance for previous day</title>
                                        </head>
                                        <body>
                                            <table>
                                                <thead>
                                                    <tr class="titlesInfo">
                                                        <td class="title-info" colspan="2">Total: ${yesterdayTotalSum.toFixed(
																													2,
																												)} $</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${translatorsSumToHtmlCode.join(
																											"",
																										)}
                                                </tbody>
                                            </table>
                                        </body>
                                    </html>
                                    `;
	return emailTemplate;
};

module.exports = getAdministratorsEmailTemplateHTMLCode;
