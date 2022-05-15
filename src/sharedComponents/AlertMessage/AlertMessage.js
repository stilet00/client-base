import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import '../../styles/sharedComponents/AlertMessage.css'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

export default function AlertMessage({
    mainText,
    additionalText,
    handleClose,
    open,
    status,
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
                    <h2>{mainText}</h2>
                    {additionalText ? <p>{additionalText}</p> : null}
                </div>
            </Modal>
        </div>
    )
}
