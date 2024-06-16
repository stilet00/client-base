import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../../../styles/modules/Form.css";
import useModal from "../../../sharedHooks/useModal";
import { faEnvelope, faAt } from "@fortawesome/free-solid-svg-icons";
import { IconButton, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { StyledModal } from "../../../sharedComponents/StyledMaterial/styledMaterialComponents";
export default function EditTranslatorEmailForm(props) {
	const emailRegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

	const [email, setEmail] = useState(props.email || "");
	const [wantsToReceiveEmails, setWantsToReceiveEmails] = useState(
		Boolean(props.wantsToReceiveEmails),
	);

	const { open, handleOpen, handleClose } = useModal();

	function onInputChange(e) {
		setEmail(e.target.value.trim());
	}

	function clear() {
		setEmail("");
	}

	useEffect(() => () => clear(), []);
	return (
		<>
			<IconButton
				type="button"
				onClick={handleOpen}
				size={"small"}
				color={Boolean(props.wantsToReceiveEmails) ? "success" : "primary"}
			>
				<FontAwesomeIcon icon={faEnvelope} />
			</IconButton>
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
					<div className={"form-container"}>
						<form
							style={{
								alignItems: "flex-start",
							}}
						>
							<h2
								id="transition-modal-title"
								style={{
									alignSelf: "center",
									marginBottom: 10,
								}}
							>
								Current email:
							</h2>
							<TextField
								id="filled-basic-2"
								label="Email address"
								name="email"
								value={email}
								variant="filled"
								fullWidth
								onChange={onInputChange}
								type={"text"}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<FontAwesomeIcon icon={faAt} />
										</InputAdornment>
									),
								}}
							/>
							<FormControlLabel
								control={
									<Switch
										checked={wantsToReceiveEmails}
										onChange={() =>
											setWantsToReceiveEmails(!wantsToReceiveEmails)
										}
										color="success"
										name="wantsToReceiveEmails"
									/>
								}
								label="Wishes to receive emails"
							/>
							<Button
								type={"button"}
								onClick={async () => {
									const translatorHasBeenUpdated =
										await props.updateTranslatorEmail(
											email,
											props.id,
											wantsToReceiveEmails,
										);
									if (translatorHasBeenUpdated) {
										handleClose();
									}
								}}
								variant={"contained"}
								color="primary"
								disabled={!emailRegExp.test(email)}
							>
								Save changes
							</Button>
						</form>
					</div>
				</Fade>
			</StyledModal>
		</>
	);
}
