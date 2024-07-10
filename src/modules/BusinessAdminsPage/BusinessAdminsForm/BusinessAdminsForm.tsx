import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "react-query";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import InputAdornment from "@mui/material/InputAdornment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import InstagramIcon from "@mui/icons-material/Instagram";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import "../../../styles/modules/BusinessAdminsForm.css";
import { DEFAULT_CLIENT } from "../../../constants/constants";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import {
	StyledModal,
	StyledTextField,
} from "../../../sharedComponents/StyledMaterial/styledMaterialComponents";
import { BusinessAdmin } from "api/models/businessAdminsDatabaseModels";
import { submitBusinessAdmin } from "services/businessAdministratorsServices";

interface BusinessAdminsFormProps {
	formOpen: boolean;
	selectedAdmin: BusinessAdmin | null;
	setSelectedAdmin: Dispatch<SetStateAction<BusinessAdmin | null>>;
	handleClose: any;
}

const BusinessAdminsForm: React.FC<BusinessAdminsFormProps> = ({
	formOpen,
	selectedAdmin,
	setSelectedAdmin,
	handleClose,
}) => {
	const [formErrors, setFormErrors] = useState<{
		email?: string;
		name?: string;
		surname?: string;
		submitError?: string;
	}>({});
	const queryClient = useQueryClient();

	const mutation = useMutation(submitBusinessAdmin, {
		onSuccess: () => {
			queryClient.invalidateQueries("businessAdministratorsQuery");
			clearClient();
			handleClose();
		},
		onError: () => {
			setFormErrors({
				submitError: "Something went wrong when trying to save business admin",
			});
		},
	});

	const validateForm = () => {
		const errors: typeof formErrors = {};

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

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setSelectedAdmin((prevState: any) => {
			if (prevState) {
				return {
					...prevState,
					[name]: value,
				};
			}
			return { [name]: value };
		});
	};

	const onFormSubmit = () => {
		const formIsValid = validateForm();
		console.log(`formIsValid: ${formIsValid}`);
		if (formIsValid && selectedAdmin) {
			mutation.mutate(selectedAdmin);
		}
		console.log(`formIsValid: ${formIsValid}`);
		// if (arrayOfEditedClientsFields.length > 0) {
		// 	await onEditClientData(client);
		// 	clearEditedClient();
		// } else {
		// 	await onAddNewClient(client);
		// }
		// setSiteFilter("svadba");
	};

	const clearClient = () => {
		setSelectedAdmin(null);
	};

	// function clearClient() {
	// 	setClient(DEFAULT_CLIENT);
	// }

	// const handleClickShowPassword = () => {
	// 	setShowPassword(!showPassword);
	// };

	// const handleMouseDownPassword = (event) => {
	// 	event.preventDefault();
	// };

	// const handleCardNumberChange = (event) => {
	// 	const { name, value } = event.target;
	// 	function changindValueToCardFormat(value) {
	// 		let arrayFromText = value.split("");
	// 		let textWIthoutSpaces = arrayFromText.filter((el) => el !== " ");
	// 		let fixedArray = textWIthoutSpaces.filter(
	// 			(el, index) => index % 4 === 0 && index !== 0,
	// 		);
	// 		if (fixedArray.length === 1) {
	// 			textWIthoutSpaces.splice(4, 0, " ");
	// 		} else if (fixedArray.length === 2) {
	// 			textWIthoutSpaces.splice(4, 0, " ");
	// 			textWIthoutSpaces.splice(9, 0, " ");
	// 		} else if (fixedArray.length === 3) {
	// 			textWIthoutSpaces.splice(4, 0, " ");
	// 			textWIthoutSpaces.splice(9, 0, " ");
	// 			textWIthoutSpaces.splice(14, 0, " ");
	// 		}
	// 		return textWIthoutSpaces.join("");
	// 	}
	// 	const newState = {
	// 		...client,
	// 		[name]: changindValueToCardFormat(value),
	// 	};
	// 	setClient(newState);

	// 	setFormErrors(handleFormValidation(newState, name));
	// };

	// const fieldsAreEmpty =
	// 	client.name === "" ||
	// 	client.surname === "" ||
	// 	!client.instagramLink ||
	// 	!client.bankAccount;

	// const handleFileInputChange = (e) => {
	// 	const file = e.target.files[0];
	// 	const reader = new FileReader();
	// 	reader.onload = (event) => {
	// 		setClient({ ...client, image: reader.result });
	// 	};
	// 	reader.readAsDataURL(file);
	// };

	// useEffect(() => {
	// 	if (arrayOfEditedClientsFields.length > 0) {
	// 		setClient(editedClient);
	// 	}
	// }, [editedClient, JSON.stringify(arrayOfEditedClientsFields)]);

	// useEffect(
	// 	() => () => {
	// 		clearClient();
	// 	},
	// 	[],
	// );

	return (
		<>
			<StyledModal
				disableEnforceFocus
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={formOpen}
				onClose={(e) => {
					handleClose();
					// clearEditedClient()
					// clearClient()
					// setSiteFilter('svadba')
					// setFormErrors({})
				}}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={formOpen}>
					<form className={"form-container business-admins-form"}>
						<h2 id="transition-modal-title" className="clients-from__header">
							Enter business admin's data:
						</h2>
						<StyledTextField
							name={"name"}
							onChange={handleChange}
							value={selectedAdmin?.name ?? ""}
							variant="outlined"
							label={"First name"}
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
							name={"surname"}
							onChange={handleChange}
							value={selectedAdmin?.surname ?? ""}
							variant="outlined"
							label={"Last name"}
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
							name={"email"}
							onChange={handleChange}
							value={selectedAdmin?.email ?? ""}
							variant="outlined"
							label={"Email"}
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
							type={"button"}
							onClick={onFormSubmit}
							fullWidth
							variant={"outlined"}
							style={{ marginTop: "10px" }}
						>
							{"Save Business Admin"}
						</Button>
					</form>
				</Fade>
			</StyledModal>
		</>
	);
};

export default BusinessAdminsForm;
