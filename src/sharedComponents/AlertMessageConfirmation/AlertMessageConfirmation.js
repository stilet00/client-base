import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import '../../styles/sharedComponents/AlertMessageConfirmation.css'
import { Button } from '@material-ui/core'
import SendIcon from '@mui/icons-material/Send'
import LoadingButton from '@mui/lab/LoadingButton'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

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
    const classes = useStyles()

    return (
        <div>
            <Modal open={open} onClose={handleClose} className={classes.modal}>
                <div
                    className={
                        status
                            ? 'message-container approve-box'
                            : 'message-container decline-box'
                    }
                >
                    <h2 className={status ? 'green-text' : 'red-text'}>
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
            </Modal>
        </div>
    )
}
