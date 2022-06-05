import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import '../../../styles/modules/Form.css'
import useModal from '../../../sharedHooks/useModal'
import {
    faHandHoldingDollar,
    faCommentsDollar,
    faDollarSign,
} from '@fortawesome/free-solid-svg-icons'
import { IconButton, InputAdornment } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DEFAULT_PENALTY } from '../../../constants/constants'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

export default function PersonalPenaltyForm({
    id,
    addPersonalPenaltyToTranslator,
}) {
    const classes = useStyles()

    const [penalty, setPenalty] = useState(DEFAULT_PENALTY)

    const { open, handleOpen, handleClose } = useModal()

    function onInputChange(e) {
        setPenalty({ ...penalty, [e.target.name]: e.target.value.trim() })
    }

    function clear() {
        setPenalty(DEFAULT_PENALTY)
    }

    useEffect(() => () => clear(), [])

    return (
        <>
            <IconButton
                type="button"
                onClick={handleOpen}
                variant={'contained'}
                size={'small'}
                color="error"
            >
                <FontAwesomeIcon icon={faHandHoldingDollar} />
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
                    <div
                        className={'form-container form-container_penalty-form'}
                    >
                        <form
                            onSubmit={e => {
                                e.preventDefault()
                                addPersonalPenaltyToTranslator(id, penalty)
                                handleClose()
                            }}
                        >
                            <h2 id="transition-modal-title">Penalty:</h2>
                            <TextField
                                id="filled-basic-2"
                                label="amount"
                                name="amount"
                                variant="filled"
                                fullWidth
                                onChange={onInputChange}
                                type={'number'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FontAwesomeIcon
                                                icon={faDollarSign}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                id="filled-basic"
                                label="Description"
                                name="description"
                                variant="filled"
                                fullWidth
                                multiline
                                rows={2}
                                onChange={onInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <FontAwesomeIcon
                                                icon={faCommentsDollar}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type={'submit'}
                                variant={'contained'}
                                color="primary"
                            >
                                Add penalty
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </>
    )
}
