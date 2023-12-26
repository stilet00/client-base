import React from 'react'
import { useSelector } from 'react-redux'
import { Route, useNavigate } from 'react-router-dom'
import { useAdminStatus } from '../../sharedHooks/useAdminStatus'
import Loader from '../../sharedComponents/Loader/Loader'

export default function PrivateRoute({ component: Component, path }) {
    const user = useSelector(state => state.auth.user)
    const { isAdmin, isLoading } = useAdminStatus(user)
    const navigate = useNavigate()

    if (isLoading) {
        return <Loader />
    }

    if (!isAdmin) {
        navigate('/')
        return null
    }

    return <Route path={path} element={<Component user={user} />} />
}
