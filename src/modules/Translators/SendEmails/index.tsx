import type React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { sendNotificationEmailsRequest } from "../../../services/translatorsServices/services";
import useWindowDimensions from "../../../sharedHooks/useWindowDimensions";
import { useAlertConfirmation } from "../../../sharedComponents/AlertMessageConfirmation/hooks";
import { useAdminStatus } from "../../../sharedHooks/useAdminStatus";
import "../../../styles/sharedComponents/AlertMessageConfirmation.css";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import { StyledModal } from "../../../sharedComponents/StyledMaterial/styledMaterialComponents";

interface SendEmailDialogProps {
	mainText: string;
	additionalText?: string;
	handleClose: () => void;
	open: boolean;
	status: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	loadingStatus: boolean;
	isDisabled: boolean;
}

function SendEmailDialog({
	mainText,
	additionalText,
	handleClose,
	open,
	status,
	onConfirm,
	onCancel,
	loadingStatus,
	isDisabled,
}: SendEmailDialogProps) {
	return (
		<StyledModal open={open} onClose={handleClose}>
			<div
				className={
					status
						? "message-container approve-box"
						: "message-container decline-box"
				}
			>
				<h2
					className={status ? "green-text" : "red-text"}
					style={{ paddingBottom: 10 }}
				>
					{mainText}
				</h2>
				{additionalText ? (
					<p style={{ paddingBottom: 10 }}>{additionalText}</p>
				) : null}
				<div className="confirmation-buttons">
					<Button variant={"outlined"} onClick={onCancel}>
						CANCEL
					</Button>
					<LoadingButton
						disabled={isDisabled}
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
	);
}

const StyledButton = styled(Button)`
    && {
        color: black;
    }
`;
const defaultMessage =
	"Continue, if you've finished all work in translator's statistics";
const SendEmails: React.FC = () => {
	const [mailoutInProgress, setMailoutInProgress] = useState<boolean>(false);
	const [displayMessage, setDisplayMessage] = useState<string>(defaultMessage);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const user = useSelector((state: any) => state.auth.user);
	const { isAdmin } = useAdminStatus();
	const {
		alertStatusConfirmation,
		openAlertConfirmation,
		closeAlertConfirmationNoReload,
	} = useAlertConfirmation();
	const { screenIsSmall } = useWindowDimensions();
	const sendNotificationEmails = async () => {
		setMailoutInProgress(true);
		try {
			const res = await sendNotificationEmailsRequest();
			if (res.status === 200) {
				setDisplayMessage(`Emails have been sent to: ${res.body.join(", ")}`);
			}
		} catch (error: any) {
			setDisplayMessage(error?.response?.body?.error || "An error occurred");
		} finally {
			setMailoutInProgress(false);
			setIsDisabled(true);
			setTimeout(() => {
				closeAlertConfirmationNoReload();
				setDisplayMessage(defaultMessage);
			}, 5000);
		}
	};
	return (
		<>
			<StyledButton
				aria-describedby={`send-emails`}
				onClick={openAlertConfirmation}
				fullWidth={screenIsSmall}
				disabled={!isAdmin}
				className="translators-container__menu-button"
				startIcon={<FontAwesomeIcon icon={faPaperPlane} />}
			>
				Send emails
			</StyledButton>
			<SendEmailDialog
				isDisabled={isDisabled}
				mainText={"Please confirm mailout"}
				additionalText={displayMessage}
				open={alertStatusConfirmation}
				handleClose={closeAlertConfirmationNoReload}
				status={false}
				onCancel={closeAlertConfirmationNoReload}
				onConfirm={sendNotificationEmails}
				loadingStatus={mailoutInProgress}
			/>
		</>
	);
};

export default SendEmails;
