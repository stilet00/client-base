import React, { useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import '../../../styles/modules/Form.css'
import useModal from '../../../sharedHooks/useModal'
import {
    faCommentsDollar,
    faDollarSign,
} from '@fortawesome/free-solid-svg-icons'
import { IconButton, InputAdornment } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DEFAULT_PENALTY } from '../../../constants/constants'
import { v4 as uuidv4 } from 'uuid'
import GavelIcon from '@mui/icons-material/Gavel'
import { StyledModal } from '../../../sharedComponents/StyledMaterial/styledMaterialComponents'
export default function PersonalPenaltyForm({
    id,
    addPersonalPenaltyToTranslator,
    suspended,
}) {
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
                        <form
                            onSubmit={e => {
                                e.preventDefault()
                                addPersonalPenaltyToTranslator(id, {
                                    ...penalty,
                                    _id: uuidv4(),
                                })
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
            </StyledModal>
        </>
    )
}
