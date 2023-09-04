import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAdminStatus } from '../../sharedHooks/useAdminStatus'
import Loader from '../../sharedComponents/Loader/Loader' // Adjust the path as needed

export default function PrivateRoute({ user, component: Component, path }) {
    const admin = useAdminStatus(user)

    if (admin === null) {
        return <Loader />
    }

    return admin ? (
        <Route path={path}>
            <Component user={user} />
        </Route>
    ) : (
        <Redirect to="/" />
    )
}
