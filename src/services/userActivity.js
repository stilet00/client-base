import { useState, useEffect } from 'react'

export function useActivity() {
    const [loggedIn, setLoggedIn] = useState(true)

    const checkForInactivity = () => {
        const expireTime = localStorage.getItem('expireTime')
        if (expireTime < Date.now()) {
            setLoggedIn(false)
        }
    }

    const updateExpireTime = () => {
        const timeOutPeriod = 1000 * 60 * 10
        const expireTime = Date.now() + timeOutPeriod
        localStorage.setItem('expireTime', expireTime)
    }

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
