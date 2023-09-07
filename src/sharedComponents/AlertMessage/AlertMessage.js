import { styled } from '@mui/system'
import Modal from '@mui/material/Modal'
import '../../styles/sharedComponents/AlertMessage.css'

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

export default function AlertMessage({
    mainText,
    additionalText,
    handleClose,
    open,
    status,
}) {
    return (
        <div>
            <StyledModal open={open} onClose={handleClose}>
                <div
                    className={
                        status
                            ? 'message-container approve-box'
                            : 'message-container decline-box'
                    }
                >
                    <h2>{mainText}</h2>
                    {additionalText ? <p>{additionalText}</p> : null}
                </div>
            </StyledModal>
        </div>
    )
}
