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
            date: 'Sep 6th 22',
        },
        {
            id: '2',
            receiver: 'Steian Andrea',
            amount: '150',
            sender: 'Anton',
            comment: 'Payment to Scout',
            date: 'Sep 5th 22',
        },
        {
            id: '3',
            receiver: 'Bavdis Mariana',
            amount: '3159',
            sender: 'Agency',
            comment: 'salary',
            date: 'Sep 5th 22',
        },
        {
            id: '4',
            receiver: 'Bavdis Mariana',
            amount: '3159',
            sender: 'Oleksandr',
            comment: 'Payment to Scout',
            date: 'Sep 7th 22',
        },
    ])

    function creatingNewPayment(payment) {
        let newPayment = { ...payment, date: moment().format('MMM Do YY') }
        setPaymentsList([...paymentsList, newPayment])
    }

    const getDateArray = arrayWithDates => {
        const uniqueDates = [
            ...new Set(
                arrayWithDates.map((payments, index) => {
                    return payments.date
                })
            ),
        ]
        const arrayWithGroupedDates = uniqueDates
            .sort()
            .reverse()
            .map(data => {
                let duplicateDates = []
                arrayWithDates.forEach(element => {
                    if (element.date === data) {
                        duplicateDates.push(element)
                    }
                })
                const groupedByDate = { date: data, dateGroup: duplicateDates }
                return groupedByDate
            })
        return arrayWithGroupedDates
    }
    const needDates = getDateArray(paymentsList)

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
                        {needDates.map((item, index) => (
                            <StatementItem key={index} {...item} />
                        ))}
                    </div>
                </ul>
            </div>
            <div className="socials button-add-container bottom-button">
                <Form newPayments={creatingNewPayment} />
            </div>
        </>
    )
}
