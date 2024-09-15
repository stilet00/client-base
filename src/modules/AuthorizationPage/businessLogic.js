import { useCallback, useRef, useState } from "react";
import firebase from "firebase";
import superagent from "superagent";
import { rootURL } from "../../services/rootURL";

import { DEFAULT_ERROR } from "../../constants/constants";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";

export const useAuthorizationPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [forgotPasswordToogle, setForgotPassword] = useState(false);
	const [
		changePasswordRequestHasBeenSent,
		setChangePasswordRequestHasBeenSent,
	] = useState(false);
	const [error, setError] = useState({
		email: DEFAULT_ERROR,
		password: DEFAULT_ERROR,
	});
	const buttonElement = useRef(null);

	const { alertOpen, closeAlert, openAlert } = useAlert();

	const onPasswordChange = useCallback(
		(e) => {
			if (error.password.status) {
				setError({ ...error, password: DEFAULT_ERROR });
				setPassword(e.target.value.trim());
			} else {
				setPassword(e.target.value.trim());
			}
		},
		[error],
	);

	const onEmailChange = useCallback(
		(e) => {
			if (error.email) {
				setError({ ...error, email: DEFAULT_ERROR });
				setEmail(e.target.value.trim());
			} else {
				setEmail(e.target.value.trim());
			}
		},
		[error],
	);

	const signInWithEmailPassword = useCallback(() => {
		firebase
			.auth()
			.setPersistence(firebase.auth.Auth.Persistence.SESSION)
			.then(() => {
				return firebase
					.auth()
					.signInWithEmailAndPassword(email, password)
					.catch((errorFromServer) => {
						const message = errorFromServer.message;
						const code = errorFromServer.code;
						if (code === "auth/user-not-found") {
							setError({
								...error,
								email: {
									...error.email,
									text: message,
									status: true,
								},
								password: { status: true, text: "" },
							});
						} else if (code === "auth/wrong-password") {
							setError({
								...error,
								password: { status: true, text: message },
							});
						} else if (code === "auth/too-many-requests") {
							setError({
								...error,
								email: {
									...error.email,
									text: message,
									status: true,
								},
								password: { status: true, text: "" },
							});
						}

						openAlert(5000);
					});
			})
			.catch((errorFromServer) => {
				const message = errorFromServer.message;
				const code = errorFromServer.code;
				if (code === "auth/user-not-found") {
					setError({
						...error,
						email: { ...error.email, text: message, status: true },
						password: { status: true, text: "" },
					});
				} else if (code === "auth/wrong-password") {
					setError({
						...error,
						password: { status: true, text: message },
					});
				} else if (code === "auth/too-many-requests") {
					setError({
						...error,
						email: { ...error.email, text: message, status: true },
						password: { status: true, text: "" },
					});
				}

				openAlert(5000);
			});
	}, [email, password, error, openAlert]);

	const handleSignIn = useCallback(
		async (e) => {
			e.preventDefault();
			buttonElement.current.focus();
			await signInWithEmailPassword();
		},
		[signInWithEmailPassword],
	);

	const clearInputFields = () => {
		setEmail("");
		setPassword("");
	};

	const onToogle = () => {
		setForgotPassword((prev) => !prev);
		setChangePasswordRequestHasBeenSent(false);
		clearInputFields();
	};

	const handleForgotPassword = async (e) => {
		try {
			await superagent.post(`${rootURL}reset-password`).send({
				email: email,
			});
		} catch (error) {
			console.error("Error:", error);
		}
		setChangePasswordRequestHasBeenSent(true);
	};

	return {
		handleSignIn,
		error,
		email,
		onEmailChange,
		password,
		onPasswordChange,
		alertOpen,
		openAlert,
		closeAlert,
		buttonElement,
		forgotPasswordToogle,
		setForgotPassword,
		onToogle,
		setChangePasswordRequestHasBeenSent,
		changePasswordRequestHasBeenSent,
		handleForgotPassword,
	};
};
