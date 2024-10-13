import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

function useSearch() {
	const [searchParams, setSearchParams] = useSearchParams({ query: "" });

	const changeSearchParams = useCallback(
		(value) => {
			setSearchParams({ query: value });
		},
		[setSearchParams],
	);

	const queryString = searchParams.get("query");

	return { queryString, changeSearchParams };
}

export default useSearch;
