import TaskList from "../TaskList/TaskList";
import FinanceStatementPage from "../FinanceStatementPage/FinanceStatementPage";
import AuthorizationPage from "../AuthorizationPage/AuthorizationPage";
import Overview from "../Overview/Overview";
import Translators from "../Translators/Translators";
import ListOfClients from "../ListOfClients/ListOfClients";
import ChartsContainer from "../Charts/ChartsContainer";
import LoggedOutPage from "../AuthorizationPage/LoggedOutPage/LoggedOutPage";

export const privateRoutes = [
	{
		component: FinanceStatementPage,
		path: "/finances",
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
