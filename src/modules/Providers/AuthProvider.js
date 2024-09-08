import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";
import { setUser } from "../../features/authSlice";
import requestWithAuth from "services/superAgentConfig";
import { rootURL } from "services/rootURL";
import { saveUserIdTokenToLocalStorage } from "sharedFunctions/sharedFunctions";
import PreloadPage from "../PreloadPage/PreloadPage";

async function checkAdminStatus(user) {
	try {
		const response = await requestWithAuth("post", `${rootURL}isAdmin`).send({
			email: user.email,
		});
		return response.body;
	} catch (error) {
		console.error("Error checking admin role:", error);
		return false;
	}
}

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [authLoading, setAuthLoading] = useState(true); // Add loading state

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				const { email, displayName, emailVerified, uid } = user;
				const isAdmin = await checkAdminStatus(user);
				dispatch(
					setUser({
						email,
						displayName,
						emailVerified,
						uid,
						isAdmin,
					}),
				);
				user
					.getIdToken()
					.then((idToken) => saveUserIdTokenToLocalStorage(idToken));

				if (pathname === "/") {
					navigate("/overview");
				} else {
					navigate(pathname);
				}
			} else {
				if (pathname !== "/") {
					navigate("/logged-out");
				}
			}
			setAuthLoading(false);
		});
		return () => unsubscribe();
	}, [dispatch, navigate, pathname]);

	if (authLoading) {
		return <PreloadPage isLoading />;
	}

	return <>{children}</>;
};

export default AuthProvider;
