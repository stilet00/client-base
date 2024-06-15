import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import "../../../styles/modules/Form.css";
import useModal from "../../../sharedHooks/useModal";
import { StyledModal } from "../../../sharedComponents/StyledMaterial/styledMaterialComponents";
export default function Form({ addTask }) {
	const [taskName, setTaskName] = useState("");

	const { open, handleOpen, handleClose } = useModal();

	function onInputChange(e) {
		setTaskName(e.target.value.trim());
	}

	function clearTaskName() {
		setTaskName("");
	}

	return (
		<div className={"modal-wrapper down-add-button"}>
			<Button type="button" onClick={handleOpen} fullWidth>
				<AddIcon />
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
					<div className={"form-container form-container_task-form"}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								addTask(taskName);
								clearTaskName();
								handleClose();
							}}
						>
							<h2 id="transition-modal-title">Enter task name:</h2>
							<TextField
								id="filled-basic"
								label="Task"
								variant="outlined"
								fullWidth
								onChange={onInputChange}
								multiline
								rows={3}
							/>
							<Button type={"submit"} fullWidth variant={"outlined"}>
								Add task
							</Button>
						</form>
					</div>
				</Fade>
			</StyledModal>
		</div>
	);
}
