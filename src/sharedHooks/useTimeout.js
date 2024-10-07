import { useCallback, useRef } from "react";

export default function useTimeout(callback, delay) {
	const timeoutId = useRef();

	const clear = useCallback(() => {
		if (timeoutId.current) {
			clearTimeout(timeoutId.current);
		}
	}, []);

	const reset = useCallback(() => {
		clear();
		timeoutId.current = setTimeout(callback, delay);
	}, [callback, delay, clear]);

	return { reset, clear };
}
