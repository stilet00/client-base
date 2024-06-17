import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { privateRoutes, publicRoutes } from "./routes";
import PreloadPage from "../PreloadPage/PreloadPage";

const AppRouter = () => {
	return (
		<Routes>
			{privateRoutes.map((route) => (
				<Route
					key={route.path}
					path={route.path}
					element={
						<Suspense fallback={<PreloadPage isLoading />}>
							<PrivateRoute component={route.component} path={route.path} />
						</Suspense>
					}
				/>
			))}
			{publicRoutes.map((route) => (
				<Route
					key={route.path}
					path={route.path}
					element={
						<Suspense fallback={<PreloadPage isLoading />}>
							<route.component />
						</Suspense>
					}
				/>
			))}
			<Route path="/*" element={<Navigate to="/" />} />
		</Routes>
	);
};

export default AppRouter;
