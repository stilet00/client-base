import React from 'react'
import { useSelector } from 'react-redux'
import { useAdminStatus } from '../../sharedHooks/useAdminStatus'
import Loader from '../../sharedComponents/Loader/Loader'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ component: Component, ...rest }) {
    const user = useSelector(state => state.auth.user)
    const { isAdmin, isLoading } = useAdminStatus(user)
    if (isLoading) {
        return <Loader />
    }

    return !!isAdmin ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/login" replace />
    )
}
