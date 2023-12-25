import React, { useCallback, useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import InputAdornment from '@mui/material/InputAdornment'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import '../../../styles/modules/TranslatorsForm.css'
import { DEFAULT_TRANSLATOR } from '../../../constants/constants'
import WorkIcon from '@mui/icons-material/Work'
import useModal from '../../../sharedHooks/useModal'
import useWindowDimensions from '../../../sharedHooks/useWindowDimensions'
import {
    StyledModal,
    StyledTextField,
} from '../../../sharedComponents/StyledMaterial/styledMaterialComponents'

export default function TranslatorsForm({ onFormSubmit, editedTranslator }) {
    const { screenIsSmall } = useWindowDimensions

    const [translator, setTranslator] = useState(
        editedTranslator || DEFAULT_TRANSLATOR
    )

    const { open, handleOpen, handleClose } = useModal()

    const handleChange = useCallback(
        e => {
            setTranslator({
                ...translator,
                [e.target.name]: e.target.value.trim(),
            })
        },
        [translator]
    )

    function clearTranslator() {
        setTranslator(DEFAULT_TRANSLATOR)
    }

    useEffect(() => () => clearTranslator(), [])

    return (
        <>
            <Button
                type="button"
                sx={{
                    color: 'black',
                }}
                onClick={handleOpen}
                fullWidth={screenIsSmall}
                startIcon={<WorkIcon />}
                className="translators-container__menu-button"
            >
                Add translator
            </Button>
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
                    <div className={'form-container clients-form'}>
                        <form>
                            <h2 id="transition-modal-title">
                                Enter translator's name and surname:
                            </h2>
                            <StyledTextField
                                name={'name'}
                                onChange={handleChange}
                                value={translator.name}
                                variant="outlined"
                                label={'Name'}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <StyledTextField
                                name={'surname'}
                                onChange={handleChange}
                                value={translator.surname}
                                variant="outlined"
                                label={'Surname'}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AssignmentIndIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type={'button'}
                                onClick={async () => {
                                    await onFormSubmit(translator)
                                    handleClose()
                                }}
                                sx={{
                                    color: 'black',
                                }}
                                fullWidth
                                variant={'outlined'}
                            >
                                Add translator
                            </Button>
                        </form>
                    </div>
                </Fade>
            </StyledModal>
        </>
    )
}
