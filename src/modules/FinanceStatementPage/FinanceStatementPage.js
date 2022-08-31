import { useState } from 'react'
import '../../styles/modules/FinanceStatementPage.css'
import SinglePayment from './SinglePayment/SinglePayment'
import moment from 'moment'

export default function FinanceStatementPage() {
    const [paymentsList, setPaymentsList] = useState([
        {
            id: '1',
            name: 'Ivanova Anna',
            amount: '150',
            sender: 'Agency',
            comment: 'monthly payment',
            date: moment().format('MMM Do YY'),
        },
        {
            id: '2',
            name: 'Steian Andrea',
            amount: '150',
            sender: 'Anton',
            comment: 'Payed to scount',
            date: moment().format('MMM Do YY'),
        },
        {
            id: '3',
            name: 'Bavdis Mariana',
            amount: '3159',
            sender: 'Agency',
            comment: 'Salary for July 2022',
            date: moment().format('MMM Do YY'),
        },
    ])

    return (
        <>
            <div className={'main-container chart-container animated-box'}>
                <div className={'category-holder'}>
                    <button className={'category-holder__button'}>
                        CLIENTS
                    </button>
                    <button className={'category-holder__button'}>
                        TRANSLATORS
                    </button>
                </div>

                <ul
                    className={'scrolled-container'}
                    style={{
                        gap: '0px',
                        height: '70vh',
                        overflow: 'auto',
                    }}
                >
                    <div className={'inner-wrapper'}>
                        <div className={'inner-wrapper__header'}>
                            29.08.2022
                        </div>
                        {paymentsList.map(item => (
                            <SinglePayment key={item.id} {...item} />
                        ))}
                    </div>
                </ul>
            </div>
        </>
    )
}
