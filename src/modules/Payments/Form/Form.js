import React, { useState } from 'react'
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

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

const senders = ['Agency', 'Oleksandr', 'Anton']

export default function Form({ createPayment }) {
    const classes = useStyles()

    const [empty, setEmpty] = useState({
        name: '',
        amount: '',
        sender: 'Agency',
        comments: '',
    })
    const [validated, setValidated] = useState(true)

    const { open, handleOpen, handleClose } = useModal()

    function onInputChange(e) {
        setEmpty({
            ...empty,
            [e.target.name]: e.target.value,
        })
    }

    const handleChange = e => {
        setEmpty({ ...empty, [e.target.name]: e.target.value })
    }

    function clearPaymentsForm() {
        setEmpty({
            name: '',
            amount: '',
            sender: 'Agency',
            comments: '',
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
                    <div className={'form-container form-container_task-form'}>
                        <form
                            onSubmit={e => {
                                e.preventDefault()
                                createPayment(empty)
                                clearPaymentsForm()
                                handleClose()
                            }}
                        >
                            <h2 id="transition-modal-title">Enter Comments</h2>
                            <TextField
                                id="filled-basic"
                                label="Comments"
                                variant="outlined"
                                fullWidth
                                name="comments"
                                onChange={onInputChange}
                            />
                            <h2 id="transition-modal-title">
                                Enter client name:
                            </h2>
                            <TextField
                                id="filled-basic"
                                label="Client Name"
                                variant="outlined"
                                fullWidth
                                name="name"
                                onChange={onInputChange}
                            />
                            <h2 id="transition-modal-title">Enter amount</h2>
                            <TextField
                                id="filled-basic"
                                label="Amount"
                                variant="outlined"
                                fullWidth
                                name="amount"
                                onChange={onInputChange}
                            />
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
                                {senders.map((item, index) => (
                                    <MenuItem key={index} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
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
