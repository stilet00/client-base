import { useCallback, useRef, useState } from "react";
import firebase from "firebase";

import { DEFAULT_ERROR } from "../../constants/constants";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";

export const useAuthorizationPage = () => {
	const [email, setEmail] = useState("");
	const [forgotPasswordToogle, setForgotPassword] = useState(false);
	const [password, setPassword] = useState("");

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
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((errorFromServer) => {
				const message = errorFromServer.message;
				const code = errorFromServer.code;
				console.log(errorFromServer);
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

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			buttonElement.current.focus();
			await signInWithEmailPassword();
		},
		[signInWithEmailPassword],
	);
	const onToogle = () => {
		setForgotPassword(!forgotPasswordToogle);
	};

	return {
		onSubmit,
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
	};
};
