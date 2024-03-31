import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import useModal from 'sharedHooks/useModal'
import {
    getStartOfPreviousDayInUTC,
    convertDateToIsoString,
} from 'sharedFunctions/sharedFunctions'
import { useAlert } from 'sharedComponents/AlertMessage/hooks'
import {
    getBalanceDay,
    createBalanceDay,
    updateBalanceDay,
} from 'services/translatorsServices/services'
import { EMPTY_BALANCE_DAY } from 'constants/constants'
import MESSAGES from 'constants/messages'

export const useBalanceForm = ({ clients, translatorId }) => {
    const { open, handleOpen, handleClose } = useModal()
    const [selectedClient, setSelectedClient] = useState(
        clients.filter(client => !client.suspended)[0]?._id
    )
    const [currentBalanceDay, setCurrentBalanceDay] = useState(null)
    const [selectedDate, setSelectedDate] = useState(
        getStartOfPreviousDayInUTC()
    )
    const changeFilter = e => {
        setSelectedDate(e)
    }
    const { alertOpen, closeAlert, openAlert, message } = useAlert()
    const queryClient = useQueryClient()
    const balanceDayQuery = useQuery(
        [
            `balanceDayForTranslatorForm${translatorId}`,
            selectedDate,
            translatorId,
            selectedClient,
            open,
        ],
        () =>
            getBalanceDay({
                translatorId,
                clientId: selectedClient,
                dateTimeId: convertDateToIsoString(selectedDate),
            }),
        {
            onSuccess: response => {
                const balanceDayExists = !!response?.data
                if (balanceDayExists) {
                    setCurrentBalanceDay(response.data)
                }
                if (!balanceDayExists) {
                    const emptyBalanceDay = new EMPTY_BALANCE_DAY(
                        translatorId,
                        selectedClient,
                        convertDateToIsoString(selectedDate)
                    )
                    setCurrentBalanceDay(emptyBalanceDay)
                }
            },
            onError: error => {
                openAlert(MESSAGES.somethingWrongWithGettingBalanceDay)
            },
            enabled: open,
            refetchOnWindowFocus: false,
        }
    )

    const balanceDayMutation = useMutation(
        balanceDayToSubmit => {
            if (!balanceDayToSubmit._id) {
                return createBalanceDay({ newBalanceDay: balanceDayToSubmit })
            }
            if (balanceDayToSubmit._id) {
                return updateBalanceDay({ balanceDayToSubmit })
            }
        },
        {
            onSuccess: response => {
                setCurrentBalanceDay(response.data)
                queryClient.invalidateQueries(
                    `balanceDaysForTranslator${translatorId}`
                )
                openAlert(MESSAGES.balanceDayHaveBeenSaved)
            },
            onError: error => {
                console.log(error)
                openAlert(MESSAGES.somethingWentWrongWithSavingBalanceDay)
            },
        }
    )
    const balanceDaySubmit = ({ currentBalanceDay }) => {
        balanceDayMutation.mutate(currentBalanceDay)
    }

    const handleClientChange = e => {
        setSelectedClient(e.target.value)
    }

    const handleChange = e => {
        const editedBalanceDay = {
            ...currentBalanceDay,
            statistics: {
                ...currentBalanceDay.statistics,
                [e.target.name]:
                    e.target.type === 'textarea'
                        ? e.target.value
                        : Number(e.target.value),
            },
        }
        setCurrentBalanceDay(editedBalanceDay)
    }
    return {
        handleOpen,
        open,
        handleClose,
        selectedClient,
        handleClientChange,
        handleChange,
        currentBalanceDay,
        messageFromBalanceDayForm: message,
        alertOpen,
        closeAlert,
        openAlert,
        balanceDaySubmit,
        changeFilter,
        selectedDate,
        balanceDayIsLoading:
            balanceDayQuery.isLoading || balanceDayMutation.isLoading,
    }
}
