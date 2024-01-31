import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useMutation } from 'react-query'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import '../../../styles/modules/Form.css'
import useModal from 'sharedHooks/useModal'
import {
    faCommentsDollar,
    faDollarSign,
} from '@fortawesome/free-solid-svg-icons'
import { IconButton, InputAdornment } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DEFAULT_PENALTY } from 'constants/constants'
import { convertDateToIsoString } from 'sharedFunctions/sharedFunctions'
import GavelIcon from '@mui/icons-material/Gavel'
import { StyledModal } from 'sharedComponents/StyledMaterial/styledMaterialComponents'
import { createPersonalPenalty } from 'services/translatorsServices/services'
import AlertMessage from 'sharedComponents/AlertMessage/AlertMessage'
import { useAlert } from 'sharedComponents/AlertMessage/hooks'
import MESSAGES from 'constants/messages'

export default function PersonalPenaltyForm({ id, suspended }) {
    const defaultPenalty = new DEFAULT_PENALTY(
        id,
        convertDateToIsoString(moment())
    )
    const [penalty, setPenalty] = useState(defaultPenalty)
    const { alertOpen, closeAlert, openAlert, message } = useAlert()

    const { open, handleOpen, handleClose } = useModal()

    function onInputChange(e) {
        setPenalty({ ...penalty, [e.target.name]: e.target.value.trim() })
    }

    function clear() {
        setPenalty(defaultPenalty)
    }

    const createPersonalPenaltyMutation = useMutation(
        () =>
            createPersonalPenalty({
                personalPenaltyData: { ...penalty, translator: id },
            }),
        {
            onSuccess: () => {
                handleClose()
            },
            onError: () => {
                openAlert(MESSAGES.somethingWentWrongWithPersonalPenalty)
            },
        }
    )

    useEffect(() => () => clear(), [])
    return (
        <>
            {!suspended && (
                <IconButton
                    type="button"
                    onClick={handleOpen}
                    size={'small'}
                    color="error"
                    sx={{ ml: `0px !important` }}
                >
                    <GavelIcon />
                </IconButton>
            )}

            <StyledModal
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
                    <div
                        className={'form-container form-container_penalty-form'}
                    >
                        <form>
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
                                type={'button'}
                                variant={'contained'}
                                color="primary"
                                onClick={async () => {
                                    await createPersonalPenaltyMutation.mutate()
                                }}
                            >
                                Add penalty
                            </Button>
                        </form>
                    </div>
                </Fade>
            </StyledModal>
            <AlertMessage
                mainText={message.text}
                open={alertOpen}
                handleOpen={openAlert}
                handleClose={closeAlert}
                status={false}
            />
        </>
    )
}
