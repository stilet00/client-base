import { useCallback, useState } from 'react'
import { DEFAULT_CLIENT } from '../../constants/constants'
import useModal from '../../sharedHooks/useModal'

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
