const moment = require('moment')

const getNotificationsEmailTemplateHTMLCode = tasks => {
    const tasksToHTMLCode = tasks.map(
        task =>
            `<tr>
                <td colspan="2" className="task_label"><span>${
                    task.taskName
                }</span></td>
            </tr>
            <tr>
                <td colspan="2" className="task_created-date"><span>Created ${moment(
                    task.created,
                    'MMMM Do YYYY, h:mm:ss'
                ).fromNow()}</span></td>
            </tr>
            `
    )
    const emailTemplate = `<!DOCTYPE html>
                                    <html lang="en">
                                        <head>
                                            <meta charset="UTF-8" />
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                            <link rel="preconnect" href="https://fonts.googleapis.com">
                                            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap" rel="stylesheet">
                                            <style type="text/css">
                                                table {
                                                    width: 450px;
                                                    margin: 50px auto;
                                                    background: linear-gradient(0deg, rgba(254,195,195,1) 16%, rgba(255,0,21,1) 100%);
                                                    border-radius: 8px;
                                                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
                                                        0 6px 6px rgba(0, 0, 0, 0.23);
                                                        border-collapse: collapse;
                                                }
                                                thead,
                                                tbody,
                                                tr {
                                                    border: none;
                                                }
                                                .titlesInfo {
                                                    font-size: 1rem;
                                                    font-weight: 700;
                                                    border-radius: 8px;
                                                }
                                                .titlesInfo > td {
                                                    padding: 1rem;
                                                    color: #ffffff;
                                                    font-family: 'Open Sans', sans-serif;
                                                }
                                                .title-info {
                                                    border-top-left-radius: 8px;
                                                    border-top-right-radius: 8px;
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
                                                .task_label {
                                                    padding: 1rem 1rem 0 1rem;
                                                    background: rgba(255,255,255,0.5);
                                                    font-weight: 700;
                                                    text-align: left;
                                                    font-size: 1rem;
                                                    font-family: 'Open Sans', sans-serif;
                                                }
                                                .task_created-date {
                                                    padding: 0 1rem 1rem 1rem;
                                                    background: rgba(255,255,255,0.5);
                                                    border-bottom: 1px solid rgba(255,255,255,0.5);
                                                    font-size: 0.7rem;
                                                    font-style: italic;
                                                    font-family: 'Open Sans', sans-serif;
                                                }
                                                .task-info-container > td {
                                                    padding: 1rem;
                                                }
                                                .tasks-amount {
                                                    font-size: 1.2rem;
                                                }
                                            </style>
                                            <title>Uncompleted tasks</title>
                                        </head>
                                        <body>
                                            <table>
                                                <thead>
                                                    <tr className="titlesInfo">
                                                        <td className="title-info" colspan="2">You have <span className="tasks-amount">${
                                                            tasks.length
                                                        }</span> uncompleted ${
        tasks.length === 1 ? 'task' : 'tasks'
    }</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${tasksToHTMLCode.join('')}
                                                </tbody>
                                            </table>
                                        </body>
                                    </html>
                                    `
    return emailTemplate
}

module.exports = { getNotificationsEmailTemplateHTMLCode }
