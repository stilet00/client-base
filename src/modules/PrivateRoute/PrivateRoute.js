import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { useAdminStatus } from '../../sharedHooks/useAdminStatus'
import Loader from '../../sharedComponents/Loader/Loader' // Adjust the path as needed

export default function PrivateRoute({ component: Component, path }) {
    const user = useSelector(state => state.auth.user)
    const { isAdmin, isLoading } = useAdminStatus(user)
    if (isLoading) {
        return <Loader />
    }
    return isAdmin ? (
        <Route path={path}>
            <Component user={user} />
        </Route>
    ) : (
        <Redirect to="/" />
    )
}
