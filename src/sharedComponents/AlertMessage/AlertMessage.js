import '../../styles/sharedComponents/AlertMessage.css'
import { StyledModal } from '../StyledMaterial/styledMaterialComponents'

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
