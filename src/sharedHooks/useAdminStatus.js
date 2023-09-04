import { useState, useEffect } from 'react'
import axios from 'axios'
import { rootURL } from '../services/rootURL'

export function useAdminStatus(user) {
    const [admin, setAdmin] = useState(false)

    useEffect(() => {
        async function checkAdminStatus() {
            try {
                const response = await axios.post(rootURL + 'isAdmin', {
                    email: user.email,
                })
                setAdmin(response.data)
            } catch (error) {
                console.error('Error checking admin role:', error)
                setAdmin(false)
            }
        }

        if (user) {
            checkAdminStatus()
        }
    }, [user])

    return admin
}
