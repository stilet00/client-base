import { styled } from '@mui/system'

import Modal from '@mui/material/Modal'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'

export const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

export const StyledFormControl = styled(FormControl)({
    margin: '1rem',
    minWidth: 120,
})
export const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root:first-child': {
        background: 'rgba(210,206,206,0.5)',
    },
})
