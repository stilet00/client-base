import { useState, useEffect } from 'react'
import { inactivityPeriod } from '../constants/constants'

export function useActivity() {
    const [loggedIn, setLoggedIn] = useState(true)

    const checkForInactivity = () => {
        const expireTime = localStorage.getItem('expireTime')
        if (expireTime < Date.now()) {
            setLoggedIn(false)
        }
    }

    const updateExpireTime = () => {
        const expireTime = Date.now() + inactivityPeriod
        localStorage.setItem('expireTime', expireTime)
    }
    // we don't check mobile events for now
    useEffect(() => {
        updateExpireTime()
        window.addEventListener('click', updateExpireTime)
        window.addEventListener('keypress', updateExpireTime)
        window.addEventListener('scroll', updateExpireTime)
        window.addEventListener('mousemove', updateExpireTime)
        return () => {
            window.addEventListener('click', updateExpireTime)
            window.addEventListener('keypress', updateExpireTime)
            window.addEventListener('scroll', updateExpireTime)
            window.addEventListener('mousemove', updateExpireTime)
        }
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            checkForInactivity()
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return {
        loggedIn,
    }
}
