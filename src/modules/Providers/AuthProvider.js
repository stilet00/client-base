import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebase from "firebase";
import { setUser } from "../../features/authSlice";
import { saveUserIdTokenToLocalStorage } from "sharedFunctions/sharedFunctions";

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const { email, displayName, emailVerified, uid } = user;
				dispatch(
					setUser({
						email,
						displayName,
						emailVerified,
						uid,
					}),
				);
				user
					.getIdToken()
					.then((idToken) => saveUserIdTokenToLocalStorage(idToken));
				if (pathname === "/") {
					navigate("/overview");
				}
			} else {
				if (pathname !== "/") {
					navigate("/logged-out");
				}
			}
		});
		return () => unsubscribe();
	}, [dispatch, navigate, pathname]);

	return <>{children}</>;
};

export default AuthProvider;
