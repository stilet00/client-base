import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import '../../../styles/modules/Form.css'
import useModal from '../../../sharedHooks/useModal'
import { faEnvelope, faAt } from '@fortawesome/free-solid-svg-icons'
import { IconButton, InputAdornment } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DEFAULT_PENALTY } from '../../../constants/constants'
import { v4 as uuidv4 } from 'uuid'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

export default function EditTranslatorEmailForm(props) {
    const classes = useStyles()
    const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    const [email, setEmail] = useState(props.email || '')

    const { open, handleOpen, handleClose } = useModal()

    function onInputChange(e) {
        setEmail(e.target.value.trim())
    }

    function clear() {
        setEmail('')
    }

    useEffect(() => () => clear(), [])
    return (
        <>
            <IconButton
                type="button"
                onClick={handleOpen}
                size={'small'}
                color="primary"
            >
                <FontAwesomeIcon icon={faEnvelope} />
            </IconButton>
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
                                props.updateTranslatorEmail(email, props.id)
                                handleClose()
                            }}
                        >
                            <h2 id="transition-modal-title">Current email:</h2>
                            <TextField
                                id="filled-basic-2"
                                label="Email address"
                                name="email"
                                value={email}
                                variant="filled"
                                fullWidth
                                onChange={onInputChange}
                                type={'text'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FontAwesomeIcon icon={faAt} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type={'submit'}
                                variant={'contained'}
                                color="primary"
                                disabled={!emailRegExp.test(email)}
                            >
                                Save changes
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </>
    )
}
