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
    comments: ['Salary', 'Payment to Scout'],
}

export default function Form({ newPayments }) {
    const classes = useStyles()

    const [empty, setEmpty] = useState({
        receiver: '',
        amount: '',
        sender: 'Agency',
        comment: '',
    })
    const [clientsNames, setClientsNames] = useState([])
    const [validated, setValidated] = useState(false)

    useEffect(() => {
        getClients().then(res => {
            if (res.status === 200) {
                setClientsNames(
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
            setEmpty({
                ...empty,
                [e.target.name]: e.target.value,
            })
            setValidated(true)
        } else setValidated(false)
    }

    function handleSubmit() {
        newPayments(empty)
    }

    const handleChange = e => {
        setEmpty({ ...empty, [e.target.name]: e.target.value })
        console.log(empty.sender)
    }

    function clearPaymentsForm() {
        setEmpty({
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
                                handleSubmit()
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
                                value={empty.receiver}
                                onChange={handleChange}
                            >
                                {clientsNames.map((clientName, index) => (
                                    <MenuItem key={index} value={clientName}>
                                        {clientName}
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
                                color="secondary"
                                fullWidth
                                name={'amount'}
                                onChange={onInputChange}
                            />
                            <Button
                                style={{ marginTop: '10px' }}
                                disabled={!validated}
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
