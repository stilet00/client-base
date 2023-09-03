import React from 'react'
import { Redirect } from 'react-router-dom'
import { useAdminStatus } from '../../sharedHooks/useAdminStatus'
import Loader from '../../sharedComponents/Loader/Loader' // Adjust the path as needed

export default function AsyncComponentRenderer({ user, component: Component }) {
    const admin = useAdminStatus(user)

    if (admin === null) {
        return <Loader />
    }

    return admin ? <Component user={user} /> : <Redirect to="/" />
}
