import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import '../../styles/modules/FinanceStatementPage.css'
import PaymentsGroup from './PaymentsGroup/PaymentsGroup'
import FinancesForm from './FinancesForm/FinancesForm'
import Loader from '../../sharedComponents/Loader/Loader'
import {
    getPaymentsRequest,
    addPaymentRequest,
    removePaymentRequest,
} from '../../services/financesStatement/services'
import { useAlertConfirmation } from '../../sharedComponents/AlertMessageConfirmation/hooks'
import AlertMessageConfirmation from '../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import { getMomentUTC } from 'sharedFunctions/sharedFunctions'

export default function FinanceStatementPage() {
    const user = useSelector(state => state.auth.user)
    const [loading, setLoading] = useState(true)
    const [paymentsList, setPaymentsList] = useState([])
    const [deletedPayment, setDeletedPayment] = useState(null)
    const [alertInfo, setAlertInfo] = useState({
        mainTitle: 'no message had been put',
        status: true,
    })
    const {
        alertStatusConfirmation,
        openAlertConfirmation,
        closeAlertConfirmationNoReload,
    } = useAlertConfirmation()
    const { alertOpen, closeAlert, openAlert } = useAlert()

    useEffect(() => {
        if (user) {
            getPaymentsRequest({})
                .then(res => {
                    if (res.status === 200) {
                        setLoading(false)
                        setPaymentsList(res.data)
                    }
                })
                .catch(err => {
                    const message = err.message
                    setLoading(false)
                    setAlertInfo({
                        ...alertInfo,
                        mainTitle: message,
                        status: false,
                    })
                    openAlert(5000)
                })
        }
    }, [user])

    function pressDeleteButton(_id) {
        const payment = paymentsList.find(item => item._id === _id)
        setDeletedPayment(payment)
        openAlertConfirmation()
        setAlertInfo({
            ...alertInfo,
            mainTitle: 'Payment has been deleted successfully',
            status: true,
        })
    }
    async function createNewPayment(payment) {
        setDeletedPayment(null)
        const newPayment = {
            ...payment,
            date: payment.date.format(),
            receiverID: payment.receiver.id,
            receiver: payment.receiver.label,
        }
        try {
            const res = await addPaymentRequest(newPayment)
            if (res.status === 200) {
                const newPaymentWithId = { ...newPayment, _id: res.data }
                setPaymentsList([...paymentsList, newPaymentWithId])
                setAlertInfo({
                    ...alertInfo,
                    mainTitle: 'new payment has been added',
                    status: true,
                })
                openAlert()
                return true
            }
        } catch (err) {
            const message = err?.response?.data?.error || 'An error occurred'
            setLoading(false)
            setAlertInfo({
                ...alertInfo,
                mainTitle: message,
                status: false,
            })
            openAlert(5000)
            return false
        }
    }

    const deletePayment = () => {
        const _id = deletedPayment._id
        removePaymentRequest(_id)
            .then(res => {
                if (res.status === 200) {
                    setPaymentsList(prevStatement =>
                        prevStatement.filter(item => item._id !== _id)
                    )
                    closeAlertConfirmationNoReload()
                    openAlert()
                }
            })
            .catch(err => {
                const message =
                    err?.response?.data?.error || 'An error occurred'
                setLoading(false)
                setAlertInfo({
                    ...alertInfo,
                    mainTitle: message,
                    status: false,
                })
                openAlert()
            })
    }

    const getStatementGroupedByDates = statements => {
        const arrayWithUniqueDates = [
            ...new Set(
                statements.map(item => {
                    return getMomentUTC(item.date).format('YYYY-MM-DD')
                })
            ),
        ]
        let sortedArrayWithUniqueDates = arrayWithUniqueDates.sort().reverse()
        const arrayWithGroupedDates = sortedArrayWithUniqueDates.map(data => {
            let groupedByDatesArray = []
            statements.forEach(statement => {
                if (
                    getMomentUTC(statement.date).format('YYYY-MM-DD') === data
                ) {
                    groupedByDatesArray.unshift(statement)
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

    const arrayOfStatementsGroupedByDate =
        getStatementGroupedByDates(paymentsList)
    return (
        <>
            {!loading && (
                <>
                    <div className={'main-container scrolled-container'}>
                        {arrayOfStatementsGroupedByDate.length > 0 && (
                            <div className={'finances-inner-wrapper'}>
                                {arrayOfStatementsGroupedByDate.map(
                                    (item, index) => (
                                        <PaymentsGroup
                                            key={index}
                                            {...item}
                                            deleteOneStatement={
                                                pressDeleteButton
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                        {arrayOfStatementsGroupedByDate.length === 0 && (
                            <h1>No payments yet</h1>
                        )}
                    </div>
                    <div className="socials button-add-container">
                        <FinancesForm handleNewPayment={createNewPayment} />
                    </div>
                    <AlertMessageConfirmation
                        mainText={
                            'Please confirm that you want to delete this payment?'
                        }
                        open={alertStatusConfirmation}
                        handleClose={closeAlertConfirmationNoReload}
                        handleOpen={openAlertConfirmation}
                        status={true}
                        onCancel={closeAlertConfirmationNoReload}
                        onConfirm={deletePayment}
                    />

                    <AlertMessage
                        mainText={alertInfo.mainTitle}
                        open={alertOpen}
                        handleOpen={openAlert}
                        handleClose={closeAlert}
                        status={alertInfo.status}
                    />
                </>
            )}
            {loading && <Loader />}
        </>
    )
}
