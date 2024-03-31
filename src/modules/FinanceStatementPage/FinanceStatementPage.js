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
import LoggedOutPage from '../AuthorizationPage/LoggedOutPage/LoggedOutPage'

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
            getPaymentsRequest()
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
    function createNewPayment(payment) {
        setDeletedPayment(null)
        const newPayment = {
            ...payment,
            date: payment.date.format('DD.MM.YYYY'),
            receiverID: payment.receiver.id,
            receiver: payment.receiver.label,
        }
        addPaymentRequest(newPayment)
            .then(res => {
                if (res.status === 200) {
                    const newPaymentWithId = { ...newPayment, _id: res.data }
                    setPaymentsList([...paymentsList, newPaymentWithId])
                    setAlertInfo({
                        ...alertInfo,
                        mainTitle: 'new payment has been added',
                        status: true,
                    })
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
                openAlert(5000)
            })
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
                    return item.date
                })
            ),
        ]
        function compareDates(item1, item2) {
            return (
                item1.split('.').reverse().join('') -
                item2.split('.').reverse().join('')
            )
        }
        let sortedArrayWithUniqueDates = arrayWithUniqueDates
            .sort(compareDates)
            .reverse()
        const arrayWithGroupedDates = sortedArrayWithUniqueDates.map(data => {
            let groupedByDatesArray = []
            statements.forEach(statement => {
                if (statement.date === data) {
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
    const page = arrayOfStatementsGroupedByDate.length ? (
        arrayOfStatementsGroupedByDate.map((item, index) => (
            <PaymentsGroup
                key={index}
                {...item}
                deleteOneStatement={pressDeleteButton}
            />
        ))
    ) : (
        <h1>No payments yet</h1>
    )
    const userIsAuthorizedAndPageIsLoaded = user && !loading
    const userIsAuthorizedAndPageIsLoading = user && loading
    const userIsNotAuthorized = !user
    return (
        <>
            {userIsAuthorizedAndPageIsLoaded && (
                <>
                    <div
                        className={
                            'main-container scrolled-container  animated-box'
                        }
                    >
                        <div className={'finances-inner-wrapper'}>{page}</div>
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
            {userIsAuthorizedAndPageIsLoading && <Loader />}
            {userIsNotAuthorized && <LoggedOutPage />}
        </>
    )
}
