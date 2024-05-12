import { useState, useEffect } from 'react'

type WindowsDimensions = {
    width: number
    height: number
}

function getWindowDimensions(): WindowsDimensions {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height,
    }
}

export default function useWindowDimensions(): {
    windowDimensions: WindowsDimensions
    screenIsSmall: boolean
} {
    const [windowDimensions, setWindowDimensions] = useState<WindowsDimensions>(
        getWindowDimensions()
    )

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return { windowDimensions, screenIsSmall: windowDimensions.width < 1000 }
}
