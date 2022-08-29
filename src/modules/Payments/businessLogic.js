import { useState, useEffect } from 'react'
import {
    getPayments,
    addPayments,
} from '../../services/paymentsListServices/services'
import moment from 'moment'

export const usePaymentsList = () => {
    const [paymentsList, setPaymentsList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        {
            getPayments().then(res => {
                setLoading(false)
                setPaymentsList(res.data)
            })
        }
    }, [])

    const newPayment = payment => {
        if (payment) {
            let newPayment = {
                name: payment.name,
                amount: payment.amount,
                sender: payment.sender,
                comments: payment.comments,
                date: moment().format('MMM Do YY'),
            }
            addPayments(newPayment).then(res => {
                if (res.status === 201) {
                    setPaymentsList(Payments => {
                        return [...Payments, newPayment]
                    })
                } else console.log('Error in request')
            })
        } else console.log('something went wrong')
    }

    return {
        paymentsList,
        setPaymentsList,
        loading,
        newPayment,
    }
}
