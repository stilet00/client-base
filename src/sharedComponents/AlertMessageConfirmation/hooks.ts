import { useCallback, useState } from 'react'

interface AlertConfirmation {
    alertStatusConfirmation: boolean
    openAlertConfirmation: () => void
    closeAlertConfirmationNoReload: () => void
}

export function useAlertConfirmation(): AlertConfirmation {
    const [alertStatusConfirmation, setAlertStatusConfirmation] =
        useState<boolean>(false)

    const openAlertConfirmation = useCallback(() => {
        setAlertStatusConfirmation(true)
    }, [])

    const closeAlertConfirmationNoReload = useCallback(() => {
        setAlertStatusConfirmation(false)
    }, [])

    return {
        alertStatusConfirmation,
        openAlertConfirmation,
        closeAlertConfirmationNoReload,
    }
}
