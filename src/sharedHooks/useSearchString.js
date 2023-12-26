import { useSearchParams } from 'react-router-dom'

function useSearch() {
    const [searchParams, setSearchParams] = useSearchParams({ query: '' })

    const changeSearchParams = value => {
        setSearchParams({ query: value })
    }

    const queryString = searchParams.get('query')

    return { queryString, changeSearchParams }
}

export default useSearch
