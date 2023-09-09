import { useState, useEffect } from 'react'
import axios from 'axios'
import { rootURL } from '../services/rootURL'

async function checkAdminStatus(user) {
    try {
        const response = await axios.post(rootURL + 'isAdmin', {
            email: user.email,
        })
        return response.data
    } catch (error) {
        console.error('Error checking admin role:', error)
        return false
    }
}

export function useAdminStatus(user) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if (!user) {
            setIsAdmin(false)
            setIsLoading(false)
        } else {
            ;(async () => {
                const isAdmin = await checkAdminStatus(user)
                setIsAdmin(isAdmin)
                setIsLoading(false)
            })()
        }
    }, [user])

    return { isAdmin, isLoading }
}
