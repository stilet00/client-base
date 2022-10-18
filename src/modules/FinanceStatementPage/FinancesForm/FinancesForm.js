import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import MenuItem from '@mui/material/MenuItem'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@material-ui/core/TextField'
import '../../../styles/modules/Form.css'
import useModal from '../../../sharedHooks/useModal'
import { getClients } from '../../../services/clientsServices/services'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import {
    FINANCE_SENDERS,
    FINANCE_COMMENTS,
    DEFAULT_STATEMENT,
    BOT_LIST,
} from '../../../constants/constants.js'
import { MobileDatePicker } from '@mui/x-date-pickers'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

export default function FinancesForm({ handleNewPayment }) {
    const classes = useStyles()

    const [paymentData, setPaymentData] = useState(DEFAULT_STATEMENT)
    const [receivers, setReceivers] = useState([])
    const [fromErrors, setFormErrors] = useState({})
    const arrayWithErrors = Object.keys(fromErrors)

    useEffect(() => {
        getClients().then(res => {
            if (res.status === 200) {
                setReceivers(
                    res.data.map(
                        clients => `${clients.name} ${clients.surname}`
                    )
                )
            }
        })
    }, [])

    const { open, handleOpen, handleClose } = useModal()

    function onInputChange(e) {
        const { name, value } = e.target
        const newState = { ...paymentData, [name]: Number(value) }
        setPaymentData(newState)
        setFormErrors(handleFormValidation(newState))
    }

    function submitNewPayment(e) {
        handleNewPayment(paymentData)
        clearPaymentsData()
        handleClose()
    }
    const handleDateChange = newDate => {
        setPaymentData({ ...paymentData, date: newDate })
    }

    const handleSelectedFieldsChange = e => {
        const { name, value } = e.target
        const newState = { ...paymentData, [name]: value }
        setPaymentData(newState)
        setFormErrors(handleFormValidation(newState))
    }

    function clearPaymentsData() {
        setPaymentData(DEFAULT_STATEMENT)
    }

    const handleFormValidation = values => {
        const errors = {}
        console.log(values.receiver)
        if (!values.receiver) {
            errors.reciever = `Please choose a receiver`
        }
        if (
            (values.comment !== 'Payment to bot' &&
                BOT_LIST.includes(values.receiver)) ||
            (values.comment === 'Payment to bot' &&
                receivers.includes(values.receiver))
        ) {
            console.log('wrong value')
            errors.reciever = `Please change reciever`
        }
        if (!values.amount || values.amount === 0) {
            errors.amount = `Enter the amount`
        }
        if (values.amount > 10000) {
            errors.amount = `Amount is too large`
        }
        if (values.amount < 10) {
            errors.amount = `Amount is too small`
        }
        return errors
    }

    const listOfReceivers =
        paymentData.comment === 'Payment to bot' ? BOT_LIST : receivers

    return (
        <div className={'modal-wrapper down-add-button'}>
            <Button type="button" onClick={handleOpen} fullWidth>
                <AddIcon />
            </Button>
            <Modal
                disableEnforceFocus
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={'form-container payment-form'}>
                        <div className={'payment-form__header'}>
                            <div className={'payment-form__header_picture'}>
                                Compose bill
                            </div>
                        </div>
                        <form
                            className="payment-form__main"
                            onSubmit={e => {
                                e.preventDefault()
                                submitNewPayment()
                            }}
                        >
                            <MobileDatePicker
                                disableFuture
                                label="Date of Payment"
                                inputFormat="MM.DD.YYYY"
                                value={paymentData.date}
                                name="date"
                                onChange={handleDateChange}
                                renderInput={params => (
                                    <TextField
                                        variant="filled"
                                        fullWidth
                                        {...params}
                                    />
                                )}
                            />
                            <FormLabel>Choose Receiver</FormLabel>
                            <TextField
                                fullWidth
                                id="outlined-select"
                                variant="filled"
                                select
                                label="Receivers"
                                name="receiver"
                                focused
                                value={paymentData.receiver}
                                onChange={handleSelectedFieldsChange}
                                error={fromErrors.reciever}
                                helperText={fromErrors.reciever}
                            >
                                {listOfReceivers.map((receiver, index) => (
                                    <MenuItem
                                        key={receiver + index}
                                        value={receiver}
                                    >
                                        {receiver}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <div className="payment-form__main_radio-container">
                                <FormControl>
                                    <FormLabel>Choose Sender</FormLabel>
                                    <RadioGroup
                                        defaultValue={FINANCE_SENDERS.agency}
                                    >
                                        {Object.values(FINANCE_SENDERS).map(
                                            sender => (
                                                <FormControlLabel
                                                    key={sender}
                                                    value={sender}
                                                    control={<Radio />}
                                                    label={sender}
                                                    name="sender"
                                                    onChange={
                                                        handleSelectedFieldsChange
                                                    }
                                                />
                                            )
                                        )}
                                    </RadioGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Choose Comment</FormLabel>
                                    <RadioGroup
                                        defaultValue={FINANCE_COMMENTS.salary}
                                    >
                                        {Object.values(FINANCE_COMMENTS).map(
                                            comment => (
                                                <FormControlLabel
                                                    key={comment}
                                                    value={comment}
                                                    control={<Radio />}
                                                    label={comment}
                                                    name="comment"
                                                    onChange={
                                                        handleSelectedFieldsChange
                                                    }
                                                />
                                            )
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <FormLabel>Enter amount</FormLabel>
                            <TextField
                                id="filled-basic"
                                type="number"
                                label="amount"
                                variant="filled"
                                error={fromErrors.amount}
                                helperText={fromErrors.amount}
                                fullWidth
                                name={'amount'}
                                minValue={0}
                                onChange={onInputChange}
                            />
                            <Button
                                style={{ marginTop: '10px' }}
                                disabled={
                                    paymentData.amount === 0 ||
                                    arrayWithErrors.length !== 0
                                }
                                type={'submit'}
                                fullWidth
                                variant={'outlined'}
                            >
                                Compose payment
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}
