import TaskList from '../TaskList/TaskList'
import FinanceStatementPage from '../FinanceStatementPage/FinanceStatementPage'
import AuthorizationPage from '../AuthorizationPage/AuthorizationPage'
import Overview from '../Overview/Overview'
import Translators from '../Translators/Translators'
import ListOfClients from '../ListOfClients/ListOfClients'
import ChartsContainer from '../Charts/ChartsContainer'

export const privateRoutes = [
    {
        component: TaskList,
        path: '/tasks',
        exact: true,
    },
    {
        component: FinanceStatementPage,
        path: '/finances',
        exact: true,
    },
]
export const publicRoutes = [
    {
        path: '/overview',
        component: Overview,
        exact: true,
    },
    {
        path: '/translators',
        component: Translators,
        exact: true,
    },
    {
        path: '/clients',
        component: ListOfClients,
        exact: true,
    },
    {
        path: '/chart',
        component: ChartsContainer,
        exact: true,
    },
    {
        path: '/',
        component: AuthorizationPage,
        exact: true,
    },
]
