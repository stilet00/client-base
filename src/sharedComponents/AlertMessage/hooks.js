import { useCallback, useState } from 'react'

export function useAlert() {
    const [alertOpen, setAlertOpen] = useState(false)

    const closeAlert = useCallback(() => {
        setAlertOpen(false)
    }, [])

    const openAlert = useCallback(
        (duration = 1500) => {
            setAlertOpen(true)
            setTimeout(closeAlert, duration)
        },
        [closeAlert]
    )

    return {
        alertOpen,
        openAlert,
        closeAlert,
    }
}
