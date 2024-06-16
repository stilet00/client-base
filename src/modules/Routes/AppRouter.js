import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { privateRoutes, publicRoutes } from "./routes";

const AppRouter = () => {
	return (
		<Routes>
			{privateRoutes.map((route) => (
				<Route
					key={route.path}
					path={route.path}
					element={
						<PrivateRoute component={route.component} path={route.path} />
					}
				/>
			))}
			{publicRoutes.map((route) => (
				<Route
					key={route.path}
					path={route.path}
					element={<route.component />}
				/>
			))}
			<Route path="/*" element={<Navigate to="/" />} />
		</Routes>
	);
};

export default AppRouter;
