import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import PrivateRoute from '../PrivateRoute/PrivateRoute'
import { privateRoutes, publicRoutes } from './routes' // Import your array of route configurations

const AppRouter = () => {
    return (
        <Switch>
            {privateRoutes.map(route => (
                <PrivateRoute
                    key={route.path}
                    component={route.component}
                    path={route.path}
                    exact={route.exact}
                />
            ))}
            {publicRoutes.map(route => (
                <Route
                    key={route.path}
                    component={route.component}
                    path={route.path}
                    exact={route.exact}
                />
            ))}
            <Redirect from="/*" to="/" />
        </Switch>
    )
}

export default AppRouter
