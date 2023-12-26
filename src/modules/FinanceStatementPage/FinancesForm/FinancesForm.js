import { useState, useEffect } from 'react'
import MenuItem from '@mui/material/MenuItem'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import '../../../styles/modules/Form.css'
import useModal from '../../../sharedHooks/useModal'
import { getClients } from '../../../services/clientsServices/services'
import { getTranslators } from '../../../services/translatorsServices/services'
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
import { StyledModal } from '../../../sharedComponents/StyledMaterial/styledMaterialComponents'

export default function FinancesForm({ handleNewPayment }) {
    const [paymentData, setPaymentData] = useState(DEFAULT_STATEMENT)
    const [receivers, setReceivers] = useState([])
    const [fromErrors, setFormErrors] = useState({})
    const [translators, setTranslators] = useState([])
    const arrayWithErrors = Object.keys(fromErrors)

    useEffect(() => {
        getClients({ noImageParams: true }).then(res => {
            if (res.status === 200) {
                setReceivers(
                    res.data.map(client => {
                        return {
                            id: client._id,
                            label: `${client.name} ${client.surname}`,
                        }
                    })
                )
            }
        })
        getTranslators({}).then(res => {
            if (res.status === 200) {
                const notSuspendedTranslators = res.data.filter(
                    translator => !translator.suspended.status
                )
                setTranslators(
                    notSuspendedTranslators.map(translator => {
                        return {
                            id: translator._id,
                            label: `${translator.name} ${translator.surname}`,
                        }
                    })
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

    const getListofRecievers = comment => {
        if (comment === 'Payment to bot') {
            return BOT_LIST
        } else if (comment === 'Payment to translator') {
            return translators
        } else {
            return receivers
        }
    }

    const listOfReceivers = getListofRecievers(paymentData.comment)

    const handleSelectedFieldsChange = e => {
        const { name, value } = e.target
        if (name === 'comment') {
            const newState = { ...paymentData, [name]: value }
            const newListOfRecievers = getListofRecievers(value)
            setPaymentData(newState)
            setFormErrors(handleFormValidation(newState, newListOfRecievers))
        } else {
            const newState = { ...paymentData, [name]: value }
            setPaymentData(newState)
            setFormErrors(handleFormValidation(newState))
        }
    }

    function clearPaymentsData() {
        setPaymentData(DEFAULT_STATEMENT)
    }

    const handleFormValidation = (values, recieversList = listOfReceivers) => {
        const errors = {}
        if (!values.receiver) {
            errors.receiver = `Please choose a receiver`
        }
        if (!recieversList.includes(values.receiver)) {
            errors.receiver = `Please change a receiver`
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

    return (
        <div className={'modal-wrapper down-add-button'}>
            <Button type="button" onClick={handleOpen} fullWidth>
                <AddIcon />
            </Button>
            <StyledModal
                disableEnforceFocus
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
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
                                error={fromErrors.receiver}
                                helperText={fromErrors.receiver}
                            >
                                {listOfReceivers.map((receiver, index) => (
                                    <MenuItem
                                        key={receiver.id + index}
                                        value={receiver}
                                    >
                                        {receiver.label}
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
                                minvalue={0}
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
            </StyledModal>
        </div>
    )
}
