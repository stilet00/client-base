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

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

const senders = ['Agency', 'Oleksandr', 'Anton']

export default function Form({ newPayments }) {
    const classes = useStyles()

    const [empty, setEmpty] = useState({
        name: '',
        amount: '',
        sender: 'Agency',
        comment: '',
    })
    const [clientsNames, setClientsNames] = useState([])
    const [validated, setValidated] = useState(true)

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
        setEmpty({
            ...empty,
            [e.target.name]: e.target.value,
        })
    }
    function handleSubmit() {
        newPayments(empty)
    }

    const handleChange = e => {
        setEmpty({ ...empty, [e.target.name]: e.target.value })
    }

    function clearPaymentsForm() {
        setEmpty({
            name: '',
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
                    <div className={'form-container'}>
                        <form
                            onSubmit={e => {
                                e.preventDefault()
                                handleSubmit()
                                clearPaymentsForm()
                                handleClose()
                            }}
                        >
                            <h2 id="transition-modal-title">Choose client:</h2>
                            <TextField
                                fullWidth
                                id="outlined-select"
                                variant="outlined"
                                select
                                label="Clients"
                                name="name"
                                value={empty.name}
                                onChange={handleChange}
                            >
                                {clientsNames.map((clientName, index) => (
                                    <MenuItem key={index} value={clientName}>
                                        {clientName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <h2 id="transition-modal-title">Choose sender:</h2>
                            <TextField
                                fullWidth
                                id="outlined-select"
                                variant="outlined"
                                select
                                label="Sender"
                                name="sender"
                                value={empty.sender}
                                onChange={handleChange}
                            >
                                {senders.map((clientName, index) => (
                                    <MenuItem key={index} value={clientName}>
                                        {clientName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <h2 id="transition-modal-title">Enter comment:</h2>
                            <TextField
                                id="filled-basic"
                                label="comment"
                                variant="outlined"
                                fullWidth
                                name={'comment'}
                                onChange={onInputChange}
                            />
                            <h2 id="transition-modal-title">Enter amount:</h2>
                            <TextField
                                id="filled-basic"
                                label="amount"
                                variant="outlined"
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
                                Submit
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}
