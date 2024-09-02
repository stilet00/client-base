import { lazy } from "react";

const TaskList = lazy(() => import("../TaskList/TaskList"));
const FinanceStatementPage = lazy(
	() => import("../FinanceStatementPage/FinanceStatementPage"),
);
const AuthorizationPage = lazy(
	() => import("../AuthorizationPage/AuthorizationPage"),
);
const Overview = lazy(() => import("../Overview/Overview"));
const Translators = lazy(() => import("../Translators/Translators"));
const ListOfClients = lazy(() => import("../ListOfClients/ListOfClients"));
const ChartsContainer = lazy(() => import("../Charts/ChartsContainer"));
const LoggedOutPage = lazy(
	() => import("../AuthorizationPage/LoggedOutPage/LoggedOutPage"),
);
const BusinessAdminsPage = lazy(() => import("../BusinessAdminsPage"));

export const privateRoutes = [
	{
		component: FinanceStatementPage,
		path: "/finances",
		exact: true,
	},
	{
		component: BusinessAdminsPage,
		path: "/business-admins",
		exact: true,
	},
];
export const publicRoutes = [
	{
		component: TaskList,
		path: "/tasks",
		exact: true,
	},
	{
		path: "/overview",
		component: Overview,
		exact: true,
	},
	{
		path: "/translators",
		component: Translators,
		exact: true,
	},
	{
		path: "/clients",
		component: ListOfClients,
		exact: true,
	},
	{
		path: "/chart",
		component: ChartsContainer,
		exact: true,
	},
	{
		path: "/",
		component: AuthorizationPage,
		exact: true,
	},
	{
		path: "/logged-out",
		component: LoggedOutPage,
		exact: true,
	},
];
