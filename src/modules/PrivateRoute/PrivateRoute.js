import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminStatus } from "../../sharedHooks/useAdminStatus";
import Loader from "../../sharedComponents/Loader/Loader";

export default function PrivateRoute({ component: Component, ...rest }) {
	const isAdmin = useAdminStatus();
	return !!isAdmin ? <Component {...rest} /> : <Navigate to="/" replace />;
}
