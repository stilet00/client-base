import { useState, useEffect } from 'react'
import '../../styles/modules/FinanceStatementPage.css'
import StatementGroup from './StatementGroup/StatementGroup'
import FinancesForm from './FinancesForm/FinancesForm'
import moment from 'moment'
import Loader from '../../sharedComponents/Loader/Loader'
import {
    getPayments,
    addPayment,
    removePayment,
} from '../../services/financesStatement/services'
import { useAlertConfirmation } from '../../sharedComponents/AlertMessageConfirmation/hooks'
import AlertMessageConfirmation from '../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation'

export default function FinanceStatementPage() {
    const [loading, setLoading] = useState(true)
    const [paymentsList, setPaymentsList] = useState([])
    const [deletedPayment, setDeletedPayment] = useState(null)
    const {
        alertStatusConfirmation,
        openAlertConfirmation,
        closeAlertConfirmationNoReload,
    } = useAlertConfirmation()

    useEffect(() => {
        getPayments().then(res => {
            if (res.status === 200) {
                setLoading(false)
                setPaymentsList(res.data)
            }
        })
    }, [])

    function getPaymentId(_id) {
        const payment = paymentsList.find(item => item._id === _id)
        setDeletedPayment(payment)
        openAlertConfirmation()
    }
    function createNewPayment(payment) {
        let newPayment = {
            ...payment,
            date: moment().format('DD MM YYYY'),
        }
        addPayment(newPayment).then(res => {
            if (res.status === 200) {
                setPaymentsList([...paymentsList, newPayment])
            } else {
                console.log('Payments did not add')
            }
        })
    }

    function deletePayment() {
        const _id = deletedPayment._id
        removePayment(_id).then(res => {
            if (res.status === 200) {
                setPaymentsList(prevStatement =>
                    prevStatement.filter(item => item._id !== _id)
                )
                closeAlertConfirmationNoReload()
            } else {
                console.log('Statement is not deleted')
                closeAlertConfirmationNoReload()
            }
        })
    }

    const getStatementGroupedByDates = statements => {
        const arrayWithUniqueDates = [
            ...new Set(
                statements.map(item => {
                    return item.date
                })
            ),
        ]
        function compareDates(item1, item2) {
            return (
                item1.split(' ').reverse().join('') -
                item2.split(' ').reverse().join('')
            )
        }
        let sortedArrayWithUniqueDates = arrayWithUniqueDates
            .sort(compareDates)
            .reverse()
        const arrayWithGroupedDates = sortedArrayWithUniqueDates.map(data => {
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
    const page =
        paymentsList.length && !loading ? (
            dates.map(item => (
                <StatementGroup
                    key={item.id}
                    {...item}
                    deletingOneStatement={getPaymentId}
                />
            ))
        ) : (
            <h1>No payments yet</h1>
        )

    return loading ? (
        <Loader />
    ) : (
        <>
            <div className={'main-container scrolled-container  animated-box'}>
                <ul
                    style={{
                        gap: '0px',
                        height: '70vh',
                        padding: '0',
                    }}
                >
                    <div className={'finances-inner-wrapper'}>{page}</div>
                </ul>
            </div>
            <div className="socials button-add-container bottom-button">
                <FinancesForm handleNewPayment={createNewPayment} />
                <AlertMessageConfirmation
                    mainText={
                        'Please confirm that you want to delete this payment?'
                    }
                    open={alertStatusConfirmation}
                    handleClose={closeAlertConfirmationNoReload}
                    handleOpen={openAlertConfirmation}
                    status={false}
                    onCancel={closeAlertConfirmationNoReload}
                    onConfirm={deletePayment}
                />
            </div>
        </>
    )
}
