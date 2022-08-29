import { useState } from 'react'
import SinglePayment from './SinglePayment/SinglePayment'
import Form from './Form/Form'
import styled from 'styled-components'
import moment from 'moment'

const Button = styled.button`
    width: 30%;
    background: rgba(255, 255, 255, 1);
    color: rgba(51, 51, 51, 1);
    border: none;
    height: 2rem;
    border-radius: 4px;
    font-family: Open sans-serif;
    transition: all 0.5s;
    :hover {
        background: rgb(192 190 190);
    }
`
const Wrapper = styled.div`
    width: 100%;
    padding: 0 1rem;
    background: rgba(255, 255, 255, 1);
    box-sizing: border-box;
`

const DataHeader = styled.div`
    background: rgba(255, 255, 255, 1);
    padding: 5px 0;
    text-align: left;
    width: 100%;
    border-bottom: 1px solid rgb(224, 224, 224);
    color: rgb(51, 51, 51, 1);
    font-size: 0.875rem;
`

const CategoryHolder = styled.div`
    margin: 1rem 0;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
`

export default function Payments() {
    const [paymentsList, setPaymentsList] = useState([
        {
            name: 'Ivanova Anna',
            amount: '150',
            sender: 'Agency',
            comments: 'monthly payment',
            date: moment().format('MMM Do YY'),
        },
        {
            name: 'Steian Andrea',
            amount: '150',
            sender: 'Anton',
            comments: 'Payed to scount',
            date: moment().format('MMM Do YY'),
        },
        {
            name: 'Bavdis Mariana',
            amount: '3159',
            sender: 'Agency',
            comments: 'Salary for July 2022',
            date: moment().format('MMM Do YY'),
        },
    ])

    return (
        <>
            <div className={'main-container chart-container animated-box'}>
                <CategoryHolder>
                    <Button>CLIENTS</Button>
                    <Button>TRANSLATORS</Button>
                </CategoryHolder>

                <ul
                    className={'scrolled-container'}
                    style={{
                        gap: '0px',
                        height: '70vh',
                        overflow: 'auto',
                    }}
                >
                    <Wrapper>
                        <DataHeader>29.08.2022</DataHeader>
                        {paymentsList.map(item => (
                            <SinglePayment {...item} />
                        ))}
                    </Wrapper>
                </ul>
            </div>
            <div className="socials button-add-container bottom-button">
                <Form />
            </div>
        </>
    )
}
