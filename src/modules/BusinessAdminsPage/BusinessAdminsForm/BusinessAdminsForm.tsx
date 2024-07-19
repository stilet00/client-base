import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";
import { useMutation, useQueryClient } from "react-query";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import InputAdornment from "@mui/material/InputAdornment";
import {
	StyledModal,
	StyledTextField,
} from "../../../sharedComponents/StyledMaterial/styledMaterialComponents";
import { BusinessAdmin } from "api/models/businessAdminsDatabaseModels";
import { submitBusinessAdmin } from "services/businessAdministratorsServices";
import "../../../styles/modules/Form.css";
import "../../../styles/modules/BusinessAdminsForm.css";

interface BusinessAdminsFormProps {
	formOpen: boolean;
	selectedAdmin: BusinessAdmin | null;
	setSelectedAdmin: Dispatch<SetStateAction<BusinessAdmin | null>>;
	handleClose: () => void;
}

interface FormErrors {
	email?: string;
	name?: string;
	surname?: string;
	submitError?: string;
}

const defaultAdmin: BusinessAdmin = {
	_id: "",
	email: "",
	name: "",
	surname: "",
};

const BusinessAdminsForm: React.FC<BusinessAdminsFormProps> = ({
	formOpen,
	selectedAdmin,
	setSelectedAdmin,
	handleClose,
}) => {
	const [formErrors, setFormErrors] = useState<FormErrors>({});
	const queryClient = useQueryClient();

	const mutation = useMutation(submitBusinessAdmin, {
		onSuccess: () => {
			queryClient.invalidateQueries("businessAdministratorsQuery");
			closeFormAndClearFormData();
		},
		onError: () => {
			setFormErrors({
				submitError: "Something went wrong when trying to save business admin",
			});
		},
	});

	const validateForm = (): boolean => {
		const errors: FormErrors = {};

		if (!selectedAdmin?.email) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(selectedAdmin?.email)) {
			errors.email = "Email address is invalid";
		}

		if (!selectedAdmin?.name) {
			errors.name = "Name is required";
		}

		if (!selectedAdmin?.surname) {
			errors.surname = "Surname is required";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setSelectedAdmin((prevState) =>
			prevState
				? { ...prevState, [name]: value }
				: { ...defaultAdmin, [name]: value },
		);
	};

	const onFormSubmit = (): void => {
		if (validateForm() && selectedAdmin) {
			mutation.mutate(selectedAdmin);
		}
	};

	const clearFormData = (): void => {
		setSelectedAdmin(null);
		setFormErrors({});
	};

	const closeFormAndClearFormData = (): void => {
		clearFormData();
		handleClose();
	};

	return (
		<StyledModal
			disableEnforceFocus
			aria-labelledby="business-admin-form"
			aria-describedby="allows-save-edit-business-admins"
			open={formOpen}
			onClose={closeFormAndClearFormData}
			closeAfterTransition
		>
			<Fade in={formOpen}>
				<div className="form-container">
					<form className="business-admins-form">
						<h2 id="transition-modal-title" className="clients-from__header">
							Enter business admin's data:
						</h2>
						<StyledTextField
							name="name"
							onChange={handleChange}
							value={selectedAdmin?.name ?? ""}
							variant="outlined"
							label="First name"
							required
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<AccountCircleIcon />
									</InputAdornment>
								),
							}}
							error={!!formErrors.name}
							helperText={formErrors.name}
							fullWidth
						/>
						<StyledTextField
							name="surname"
							onChange={handleChange}
							value={selectedAdmin?.surname ?? ""}
							variant="outlined"
							label="Last name"
							required
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<AccountCircleIcon />
									</InputAdornment>
								),
							}}
							error={!!formErrors.surname}
							helperText={formErrors.surname}
							fullWidth
						/>
						<StyledTextField
							name="email"
							onChange={handleChange}
							value={selectedAdmin?.email ?? ""}
							variant="outlined"
							label="Email"
							required
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<AlternateEmailIcon />
									</InputAdornment>
								),
							}}
							fullWidth
							error={!!formErrors.email}
							helperText={formErrors.email}
						/>
						{formErrors.submitError && (
							<p style={{ color: "red", margin: 0 }}>
								{formErrors.submitError}
							</p>
						)}
						<Button
							type="button"
							onClick={onFormSubmit}
							fullWidth
							variant="outlined"
							style={{ marginTop: "10px" }}
						>
							Save Business Admin
						</Button>
					</form>
				</div>
			</Fade>
		</StyledModal>
	);
};

export default BusinessAdminsForm;
