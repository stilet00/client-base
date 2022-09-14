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
    SENDERS,
    COMMENTS,
    DEFAULT_STATEMENT,
} from '../../../constants/constants.js'

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
    const [formValidation, setFormValidation] = useState(false)
    const [fromErrors, setFormErrors] = useState({})

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
        setPaymentData({
            ...paymentData,
            [name]: value,
        })
    }

    function submitNewPayment(e) {
        setFormErrors(handleFormValidation(paymentData))
        setFormValidation(true)
    }

    const handeOptionalFieldsChange = e => {
        let name = e.target.name
        switch (name) {
            case 'receiver':
                setPaymentData({
                    ...paymentData,
                    [e.target.name]: e.target.value,
                })
                break
            case 'comment':
                let comment = COMMENTS.find(
                    item => item.name === e.target.value
                )
                setPaymentData({
                    ...paymentData,
                    [e.target.name]: e.target.value,
                    image: comment.image,
                })
                break
            case 'sender':
                let sender = SENDERS.find(item => item.name === e.target.value)
                setPaymentData({
                    ...paymentData,
                    [e.target.name]: e.target.value,
                    avatar: sender.avatar,
                })
                break
            default:
                setPaymentData({
                    ...paymentData,
                    [e.target.name]: e.target.value,
                })
        }
    }

    function clearPaymentsForm() {
        setPaymentData(DEFAULT_STATEMENT)
    }

    const handleFormValidation = values => {
        const errors = {}
        if (!values.receiver) {
            errors.reciever = `Please choose a receiver`
        }
        if (!values.amount) {
            errors.amount = `Enter the amount`
        }
        if (values.amount > 10000) {
            errors.amount = `amount is too large`
        }
        if (values.amount < 100) {
            errors.amount = `amount is too small`
        }

        return errors
    }
    useEffect(() => {
        if (Object.keys(fromErrors).length === 0 && formValidation) {
            handleNewPayment(paymentData)
            clearPaymentsForm()
            handleClose()
        }
    }, [fromErrors])

    return (
        <div className={'modal-wrapper down-add-button'}>
            <Button type="button" onClick={handleOpen} fullWidth>
                <AddIcon />
            </Button>
            <Modal
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
                                onChange={handeOptionalFieldsChange}
                                error={fromErrors.reciever}
                                helperText={fromErrors.reciever}
                            >
                                {receivers.map((receiver, index) => (
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
                                    <RadioGroup defaultValue={SENDERS[0].name}>
                                        {SENDERS.map((sender, index) => (
                                            <FormControlLabel
                                                key={sender.name + index}
                                                value={sender.name}
                                                control={<Radio />}
                                                label={sender.name}
                                                name="sender"
                                                onChange={
                                                    handeOptionalFieldsChange
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Choose Comment</FormLabel>
                                    <RadioGroup defaultValue={COMMENTS[0].name}>
                                        {COMMENTS.map((comment, index) => (
                                            <FormControlLabel
                                                key={comment.name + index}
                                                value={comment.name}
                                                control={<Radio />}
                                                label={comment.name}
                                                name="comment"
                                                onChange={
                                                    handeOptionalFieldsChange
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <FormLabel>Enter amount</FormLabel>
                            <TextField
                                id="filled-basic"
                                type="number"
                                label="amount"
                                variant="filled"
                                fullWidth
                                name={'amount'}
                                onChange={onInputChange}
                                error={fromErrors.amount}
                                helperText={fromErrors.amount}
                            />
                            <Button
                                style={{ marginTop: '10px' }}
                                type={'submit'}
                                fullWidth
                                variant={'outlined'}
                            >
                                compose
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}
