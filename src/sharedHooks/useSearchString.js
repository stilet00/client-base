import { useState, useDeferredValue, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function useSearch() {
    const [search, setSearch] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const deferredSearch = useDeferredValue(search, { timeoutMs: 500 })

    function onSearchChange(e) {
        setSearch(e.target.value.toLowerCase())
    }

    useEffect(() => {
        setSearchParams(deferredSearch)
    }, [deferredSearch])

    return { search: deferredSearch, onSearchChange }
}

export default useSearch
