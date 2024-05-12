import '../../styles/sharedComponents/AlertMessageConfirmation.css'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import LoadingButton from '@mui/lab/LoadingButton'
import { StyledModal } from '../StyledMaterial/styledMaterialComponents'

export default function AlertMessageConfirmation({
    mainText,
    additionalText,
    handleClose,
    open,
    status,
    onConfirm,
    onCancel,
    loadingStatus,
}) {
    return (
        <StyledModal open={open} onClose={handleClose}>
            <div
                className={
                    status
                        ? 'message-container approve-box'
                        : 'message-container decline-box'
                }
            >
                <h2
                    className={status ? 'green-text' : 'red-text'}
                    style={{ paddingBottom: 10 }}
                >
                    {mainText}
                </h2>
                {additionalText ? <p>{additionalText}</p> : null}
                <div className="confirmation-buttons">
                    <Button variant={'outlined'} onClick={onCancel}>
                        CANCEL
                    </Button>
                    <LoadingButton
                        onClick={onConfirm}
                        endIcon={<SendIcon />}
                        loading={loadingStatus}
                        loadingPosition="end"
                        variant="contained"
                    >
                        CONFIRM
                    </LoadingButton>
                </div>
            </div>
        </StyledModal>
    )
}
