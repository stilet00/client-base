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

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

const senders = {
    names: ['Agency', 'Oleksandr', 'Anton'],
    comments: ['salary', 'Payment to Scout'],
}

export default function FinancesForm({ handleNewPayment }) {
    const classes = useStyles()

    const [paymentsData, setPaymentsData] = useState({
        receiver: '',
        amount: '',
        sender: 'Agency',
        comment: '',
    })
    const [receivers, setReceivers] = useState([])
    const [formValidation, setFormValidation] = useState(false)

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
        if (e.target.value !== '' && /\d/.test(e.target.value)) {
            setPaymentsData({
                ...paymentsData,
                [e.target.name]: e.target.value,
            })
            setFormValidation(true)
        } else setFormValidation(false)
    }

    function onSubmit() {
        handleNewPayment(paymentsData)
    }

    const handleChange = e => {
        setPaymentsData({ ...paymentsData, [e.target.name]: e.target.value })
        console.log(paymentsData.sender)
    }

    function clearPaymentsForm() {
        setPaymentsData({
            receiver: '',
            amount: '',
            sender: 'Agency',
            comment: '',
        })
    }

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
                                onSubmit()
                                clearPaymentsForm()
                                handleClose()
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
                                value={paymentsData.receiver}
                                onChange={handleChange}
                            >
                                {receivers.map((receiver, index) => (
                                    <MenuItem key={index} value={receiver}>
                                        {receiver}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <div className="payment-form__main_radio-container">
                                <FormControl>
                                    <FormLabel>Choose Sender</FormLabel>
                                    <RadioGroup>
                                        {senders.names.map((sender, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={sender}
                                                control={<Radio />}
                                                label={sender}
                                                name="sender"
                                                onChange={handleChange}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Choose Comment</FormLabel>
                                    <RadioGroup>
                                        {senders.comments.map(
                                            (comment, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    value={comment}
                                                    control={<Radio />}
                                                    label={comment}
                                                    name="comment"
                                                    onChange={handleChange}
                                                />
                                            )
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <FormLabel>Enter amount</FormLabel>
                            <TextField
                                id="filled-basic"
                                label="amount"
                                variant="filled"
                                fullWidth
                                name={'amount'}
                                onChange={onInputChange}
                            />
                            <Button
                                style={{ marginTop: '10px' }}
                                disabled={!formValidation}
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
