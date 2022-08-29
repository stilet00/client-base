import React from 'react'
import Loader from '../../sharedComponents/Loader/Loader'
import SinglePayment from './SinglePayment/SinglePayment'
import Form from './Form/Form'
import { usePaymentsList } from './businessLogic'
import styled from 'styled-components'

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
export default function Payments() {
    const { paymentsList, loading, newPayment } = usePaymentsList()
    const page =
        paymentsList.length && !loading ? (
            paymentsList.map(item => <SinglePayment key={item.id} {...item} />)
        ) : loading ? (
            <Loader />
        ) : (
            <h1>No payments yet</h1>
        )
    return (
        <>
            <div className={'main-container chart-container animated-box'}>
                <div
                    className={'category-holder'}
                    style={{
                        margin: '1rem 0',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <Button>CLIENTS</Button>
                    <Button>TRANSLATORS</Button>
                </div>

                <ul
                    className={'scrolled-container'}
                    style={{
                        gap: '0px',
                        height: '70vh',
                        overflow: 'auto',
                    }}
                >
                    <div
                        className={'ul-wrapper'}
                        style={{
                            width: '100%',
                            padding: '0 1rem',
                            background: 'rgba(255, 255, 255, 1)',
                            boxSizing: 'border-box',
                        }}
                    >
                        <div
                            className={'data-header'}
                            style={{
                                background: 'rgba(255, 255, 255, 1)',
                                padding: '5px 0',
                                textAlign: 'left',
                                width: '100%',
                                borderBottom: '1px solid rgb(224, 224, 224) ',
                                color: 'rgb(51, 51, 51, 1)',
                                fontSize: '0.875rem',
                            }}
                        >
                            29.08.2022
                        </div>
                        {page}
                    </div>
                </ul>
            </div>
            <div className="socials button-add-container bottom-button">
                <Form createPayment={newPayment} />
            </div>
        </>
    )
}
