import { useState } from 'react'
import '../../styles/modules/FinanceStatementPage.css'
import StatementItem from './StatementItem/StatementItem'
import Form from './Form/Form'
import moment from 'moment'


export default function FinanceStatementPage() {
    const [paymentsList, setPaymentsList] = useState([
        {
            id: '1',
            receiver: 'Ivanova Anna',
            amount: '150',
            sender: 'Agency',
            comment: 'salary',
            date: '05 09 22',
        },
        {
            id: '2',
            receiver: 'Steian Andrea',
            amount: '150',
            sender: 'Anton',
            comment: 'Payment to Scout',
            date: '07 09 22',
        },
        {
            id: '3',
            receiver: 'Bavdis Mariana',
            amount: '3159',
            sender: 'Agency',
            comment: 'salary',
            date: '06 09 22',
        },
        {
            id: '4',
            receiver: 'Bavdis Mariana',
            amount: '3159',
            sender: 'Oleksandr',
            comment: 'Payment to Scout',
            date: '07 09 22',
        },
    ])

    function createNewPayment(payment) {
        let newPayment = { ...payment, date: moment().format('DD MM YYYY') }
        setPaymentsList([...paymentsList, newPayment])
    }

    const getStatementGroupedByDates = statements => {
        const arrayWithUniqueDates = [
            ...new Set(
                statements.map(item => {
                    return item.date
                })
            ),
        ]
        const arrayWithGroupedDates = arrayWithUniqueDates
            .sort()
            .reverse()
            .map(data => {
                let groupedByDatesArray = []
                statements.forEach(statement => {
                    if (statement.date === data) {
                        groupedByDatesArray.push(statement)
                    }
                })
                const statementsGroupedByDate = {
                    date: data,
                    dateGroup: groupedByDatesArray,
                }
                return statementsGroupedByDate
            })
        return arrayWithGroupedDates
    }
    const dates = getStatementGroupedByDates(paymentsList)

    return (
        <>
            <div className={'main-container scrolled-container  animated-box'}>
                <ul
                    style={{
                        gap: '0px',
                        height: '70vh',
                        padding: '0',
                    }}
                >
                    <div className={'finances-inner-wrapper'}>
                        {dates.map((item, index) => (
                            <StatementItem key={index} {...item} />
                        ))}
                    </div>
                </ul>
            </div>
            <div className="socials button-add-container bottom-button">
                <Form handleNewPayment={createNewPayment} />
            </div>
        </>
    )
}
