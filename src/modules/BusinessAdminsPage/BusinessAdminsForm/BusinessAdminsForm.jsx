"use strict";
var __assign =
	(this && this.__assign) ||
	function () {
		__assign =
			Object.assign ||
			function (t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s)
						if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_query_1 = require("react-query");
var Backdrop_1 = __importDefault(require("@mui/material/Backdrop"));
var Fade_1 = __importDefault(require("@mui/material/Fade"));
var Button_1 = __importDefault(require("@mui/material/Button"));
var AccountCircle_1 = __importDefault(
	require("@mui/icons-material/AccountCircle"),
);
var AlternateEmail_1 = __importDefault(
	require("@mui/icons-material/AlternateEmail"),
);
var InputAdornment_1 = __importDefault(require("@mui/material/InputAdornment"));
var styledMaterialComponents_1 = require("../../../sharedComponents/StyledMaterial/styledMaterialComponents");
var businessAdministratorsServices_1 = require("services/businessAdministratorsServices");
var defaultAdmin = {
	_id: "",
	email: "",
	name: "",
	surname: "",
};
var BusinessAdminsForm = function (_a) {
	var _b, _c, _d;
	var formOpen = _a.formOpen,
		selectedAdmin = _a.selectedAdmin,
		setSelectedAdmin = _a.setSelectedAdmin,
		handleClose = _a.handleClose;
	var _e = (0, react_1.useState)({}),
		formErrors = _e[0],
		setFormErrors = _e[1];
	var queryClient = (0, react_query_1.useQueryClient)();
	var mutation = (0, react_query_1.useMutation)(
		businessAdministratorsServices_1.submitBusinessAdmin,
		{
			onSuccess: function () {
				queryClient.invalidateQueries("businessAdministratorsQuery");
				closeFormAndClearFormData();
			},
			onError: function () {
				setFormErrors({
					submitError:
						"Something went wrong when trying to save business admin",
				});
			},
		},
	);
	var validateForm = function () {
		var errors = {};
		if (
			!(selectedAdmin === null || selectedAdmin === void 0
				? void 0
				: selectedAdmin.email)
		) {
			errors.email = "Email is required";
		} else if (
			!/\S+@\S+\.\S+/.test(
				selectedAdmin === null || selectedAdmin === void 0
					? void 0
					: selectedAdmin.email,
			)
		) {
			errors.email = "Email address is invalid";
		}
		if (
			!(selectedAdmin === null || selectedAdmin === void 0
				? void 0
				: selectedAdmin.name)
		) {
			errors.name = "Name is required";
		}
		if (
			!(selectedAdmin === null || selectedAdmin === void 0
				? void 0
				: selectedAdmin.surname)
		) {
			errors.surname = "Surname is required";
		}
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};
	var handleChange = function (e) {
		var _a = e.target,
			name = _a.name,
			value = _a.value;
		setSelectedAdmin(function (prevState) {
			var _a, _b;
			return prevState
				? __assign(__assign({}, prevState), ((_a = {}), (_a[name] = value), _a))
				: __assign(
						__assign({}, defaultAdmin),
						((_b = {}), (_b[name] = value), _b),
					);
		});
	};
	var onFormSubmit = function () {
		if (validateForm() && selectedAdmin) {
			mutation.mutate(selectedAdmin);
		}
	};
	var clearFormData = function () {
		setSelectedAdmin(null);
		setFormErrors({});
	};
	var closeFormAndClearFormData = function () {
		clearFormData();
		handleClose();
	};
	return (
		<styledMaterialComponents_1.StyledModal
			disableEnforceFocus
			aria-labelledby="business-admin-form"
			aria-describedby="allows-save-edit-business-admins"
			open={formOpen}
			onClose={closeFormAndClearFormData}
			closeAfterTransition
			BackdropComponent={Backdrop_1.default}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade_1.default in={formOpen}>
				<form className="form-container business-admins-form">
					<h2 id="transition-modal-title" className="clients-from__header">
						Enter business admin's data:
					</h2>
					<styledMaterialComponents_1.StyledTextField
						name="name"
						onChange={handleChange}
						value={
							(_b =
								selectedAdmin === null || selectedAdmin === void 0
									? void 0
									: selectedAdmin.name) !== null && _b !== void 0
								? _b
								: ""
						}
						variant="outlined"
						label="First name"
						required
						InputProps={{
							startAdornment: (
								<InputAdornment_1.default position="start">
									<AccountCircle_1.default />
								</InputAdornment_1.default>
							),
						}}
						error={!!formErrors.name}
						helperText={formErrors.name}
						fullWidth
					/>
					<styledMaterialComponents_1.StyledTextField
						name="surname"
						onChange={handleChange}
						value={
							(_c =
								selectedAdmin === null || selectedAdmin === void 0
									? void 0
									: selectedAdmin.surname) !== null && _c !== void 0
								? _c
								: ""
						}
						variant="outlined"
						label="Last name"
						required
						InputProps={{
							startAdornment: (
								<InputAdornment_1.default position="start">
									<AccountCircle_1.default />
								</InputAdornment_1.default>
							),
						}}
						error={!!formErrors.surname}
						helperText={formErrors.surname}
						fullWidth
					/>
					<styledMaterialComponents_1.StyledTextField
						name="email"
						onChange={handleChange}
						value={
							(_d =
								selectedAdmin === null || selectedAdmin === void 0
									? void 0
									: selectedAdmin.email) !== null && _d !== void 0
								? _d
								: ""
						}
						variant="outlined"
						label="Email"
						required
						InputProps={{
							startAdornment: (
								<InputAdornment_1.default position="start">
									<AlternateEmail_1.default />
								</InputAdornment_1.default>
							),
						}}
						fullWidth
						error={!!formErrors.email}
						helperText={formErrors.email}
					/>
					{formErrors.submitError && (
						<p style={{ color: "red", margin: 0 }}>{formErrors.submitError}</p>
					)}
					<Button_1.default
						type="button"
						onClick={onFormSubmit}
						fullWidth
						variant="outlined"
						style={{ marginTop: "10px" }}
					>
						Save Business Admin
					</Button_1.default>
				</form>
			</Fade_1.default>
		</styledMaterialComponents_1.StyledModal>
	);
};
exports.default = BusinessAdminsForm;
