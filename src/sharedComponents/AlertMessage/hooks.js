import { useCallback, useState } from "react";

export function useAlert() {
	const [message, setMessage] = useState("");
	const [alertOpen, setAlertOpen] = useState(false);

	const closeAlert = useCallback(() => {
		setAlertOpen(false);
	}, []);

	const openAlert = useCallback((alertMessage, duration = 1000) => {
		setMessage(alertMessage);
		setAlertOpen(true);
		setTimeout(closeAlert, duration);
	}, []);

	return {
		alertOpen,
		openAlert,
		closeAlert,
		message,
		setMessage,
	};
}
