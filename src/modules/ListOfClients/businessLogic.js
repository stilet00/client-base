import { useCallback, useState } from 'react'
import { DEFAULT_CLIENT, currentYear } from '../../constants/constants'
import useModal from '../../sharedHooks/useModal'
import {
    calculateBalanceDaySum,
    getMiddleValueFromArray,
    getSumFromArray,
    getNumberWithHundreds,
} from 'sharedFunctions/sharedFunctions'
import moment from 'moment'

export const useClientsForm = ({ onFormSubmit, editedClient }) => {
    const [client, setClient] = useState(editedClient || DEFAULT_CLIENT)

    const { handleClose, handleOpen, open } = useModal()

    const handleChange = useCallback(
        e => {
            setClient({ ...client, [e.target.name]: e.target.value.trim() })
        },
        [client]
    )

    function clearClient() {
        setClient(DEFAULT_CLIENT)
    }

    return {
        handleOpen,
        open,
        client,
        clearClient,
        handleClose,
        onFormSubmit,
        handleChange,
    }
}

// export const useClientsList = () => {

//     return {
//         clientMonthSum,
//         sortBySum,
//         calculateMiddleMonthSum,
//         getAllAsignedTranslators,
//         getArrayOfBalancePerDay,
//         getTotalProfitPerClient,
//         currentYear,
//     }
// }
