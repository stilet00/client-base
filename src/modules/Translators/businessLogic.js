import { useCallback, useEffect, useState, useMemo } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import MESSAGES from "constants/messages";
import { useAlert } from "sharedComponents/AlertMessage/hooks";
import {
	addTranslator,
	getTranslators,
	removeTranslator,
	updateTranslator,
	sendLastVirtualGiftDateRequest,
	assignClientToTranslatorRequest,
	getBalanceDaysForTranslatorRequest,
	getPenaltiesForTranslatorRequest,
	toggleClientSuspendedRequest,
} from "services/translatorsServices/services";
import { getCurrency } from "services/currencyServices";
import { useAlertConfirmation } from "sharedComponents/AlertMessageConfirmation/hooks";

import {
	calculateBalanceDaySum,
	getMiddleValueFromArray,
	getStartOfPreviousDayInUTC,
	getMomentUTC,
} from "sharedFunctions/sharedFunctions";

export const useTranslators = (user) => {
	const [translators, setTranslators] = useState([]);
	const [currentClient, setCurrentClient] = useState(null);
	const [dollarToUahRate, setDollarToUahRate] = useState(null);
	const [state, setState] = useState({
		left: false,
	});
	const [loading, setLoading] = useState(true);
	const [mailoutInProgress, setMailoutInProgress] = useState(false);
	const { alertOpen, closeAlert, openAlert, message, setMessage } = useAlert();
	const [deletedTranslator, setDeletedTranslator] = useState(null);
	const [translatorFilter, setTranslatorFilter] = useState({
		suspended: true,
		date: getMomentUTC().subtract(1, "day"),
	});
	const {
		alertStatusConfirmation,
		openAlertConfirmation,
		closeAlertConfirmationNoReload,
	} = useAlertConfirmation();

	const changeFilter = useCallback(
		(e) => {
			const newFilter = {
				...translatorFilter,
				[e.target.name]: !translatorFilter[e.target.name],
			};

			setTranslatorFilter(newFilter);
		},
		[translatorFilter],
	);

	const filterTranslators = useCallback(() => {
		if (translatorFilter.suspended) {
			return translators.filter(
				(translator) =>
					translator.suspended.status !== translatorFilter.suspended,
			);
		} else {
			return translators;
		}
	}, [translators, translatorFilter]);

	const memoizedFilteredTranslators = useMemo(
		() => filterTranslators(),
		[translators, translatorFilter],
	);

	const fetchCurrency = async () => {
		const response = await getCurrency();
		if (response.status !== 200)
			throw new Error(MESSAGES.somethingWrongWithCurrencies);
		return response.body[1]?.buy ?? "36.57";
	};

	const fetchTranslators = async () => {
		const response = await getTranslators({ shouldGetClients: true });
		if (response.status !== 200)
			throw new Error(MESSAGES.somethingWrongWithGettingTranslators);
		return response.body;
	};

	const { isLoading: currencyIsLoading } = useQuery(
		"currencyForTranslators",
		fetchCurrency,
		{
			enabled: !!user,
			onSuccess: (data) => setDollarToUahRate(data),
			onError: () => openAlert(MESSAGES.somethingWrongWithCurrencies),
		},
	);
	const { isLoading: translatorsAreLoading } = useQuery(
		"translatorsForTranslators",
		fetchTranslators,
		{
			enabled: !!user,
			onSuccess: (data) => setTranslators(data),
			onError: () => openAlert(MESSAGES.somethingWrongWithGettingTranslators),
		},
	);

	useEffect(() => {
		if (!currencyIsLoading && !translatorsAreLoading) {
			setLoading(false);
		}
	}, [currencyIsLoading, translatorsAreLoading]);

	const toggleDrawer = useCallback(
		(anchor, open) => (event) => {
			if (
				event.type === "keydown" &&
				(event.key === "Tab" || event.key === "Shift")
			) {
				return;
			}
			setState({ ...state, [anchor]: open });
		},
		[state],
	);

	const dragStartHandler = useCallback((e, client) => {
		setCurrentClient(client);
		e.target.style.border = "2px solid black";
	}, []);

	const dragLeaveHandler = useCallback((e) => {
		setState({ left: false });
		if (e.target.tagName === "UL") {
			e.target.style.background = "none";
		} else if (e.target.tagName === "LI") {
			e.target.parentNode.style.background = "none";
		}
	}, []);

	const dragEndHandler = useCallback((e) => {
		e.target.style.background = "none";
	}, []);

	const dragOverHandler = useCallback((e) => {
		e.preventDefault();
		if (e.target.tagName === "UL") {
			e.target.style.background = "rgba(255,255,255, 0.5)";
		} else if (e.target.tagName === "LI") {
			e.target.parentNode.style.background = "rgba(255,255,255, 0.5)";
		}
	}, []);

	const dragDropHandler = useCallback((e, task, board) => {
		e.preventDefault();
		e.target.style.background = "none";
	}, []);

	const saveChangedTranslator = useCallback(
		async (editedTranslator, message) => {
			try {
				const res = await updateTranslator(editedTranslator);
				if (res.status === 200) {
					openAlert(message);
					setTranslators(
						translators.map((item) =>
							item._id === editedTranslator._id ? editedTranslator : item,
						),
					);
				}
				return true;
			} catch (error) {
				const erroMessageForShowAlertMessage = {
					text: error?.response?.body?.error || "An error occurred",
					status: false,
				};
				openAlert(erroMessageForShowAlertMessage, 5000);
				console.error("An error occurred:", error);
				return false;
			}
		},
		[translators, openAlert],
	);

	const assignClientToTranslator = async ({ translatorId, clientId }) => {
		const editedTranslator = translators.find(
			(item) => item._id === translatorId,
		);
		if (
			editedTranslator.clients.some((item) => item._id === currentClient._id)
		) {
			openAlert(MESSAGES.clientExist);
			return;
		}
		const responseFromAssignClientToTranslator =
			await assignClientToTranslatorRequest({ translatorId, clientId });
		if (responseFromAssignClientToTranslator.status === 200) {
			const editedTranslator = translators.find(
				(item) => item._id === translatorId,
			);
			editedTranslator.clients.push({
				...currentClient,
			});
			setTranslators(
				translators.map((item) =>
					item._id === editedTranslator._id ? editedTranslator : item,
				),
			);
		}
		if (responseFromAssignClientToTranslator.status !== 200) {
			openAlert(MESSAGES.somethingWrongWithAssigningClient);
		}
	};

	const onBoardDrop = useCallback(
		async (e, translatorID) => {
			e.preventDefault();
			if (e.target.tagName === "UL") {
				e.target.style.background = "none";
			} else if (e.target.tagName === "LI") {
				e.target.parentNode.style.background = "none";
			}
			await assignClientToTranslator({
				translatorId: translatorID,
				clientId: currentClient._id,
			});
		},
		[translators, currentClient, openAlert, openAlert],
	);

	const startTranslatorDelete = useCallback(
		(id) => {
			const translator = translators.find((item) => item._id === id);

			setDeletedTranslator(translator);

			setMessage({
				text: `You are deleting ${translator.name} ${translator.surname}`,
				status: false,
			});

			openAlertConfirmation();
		},
		[translators, openAlertConfirmation],
	);

	const finishTranslatorDelete = useCallback(() => {
		removeTranslator(deletedTranslator._id).then((res) => {
			if (res.status === 200) {
				closeAlertConfirmationNoReload();
				setTranslators(
					translators.filter((item) => item._id !== deletedTranslator._id),
				);
				setMessage(MESSAGES.addTranslator);
			} else {
				openAlert(MESSAGES.somethingWrong);
			}
		});
	}, [
		translators,
		openAlert,
		closeAlertConfirmationNoReload,
		deletedTranslator,
	]);

	const translatorsFormSubmit = async (newTranslator) => {
		const { body, status } = await addTranslator(newTranslator);
		if (status === 200) {
			openAlert(MESSAGES.addTranslator);
			setTranslators([
				...translators,
				{ ...newTranslator, clients: [], _id: body },
			]);
		} else {
			openAlert(MESSAGES.somethingWrong, 5000);
		}
	};

	const suspendTranslator = useCallback(
		(translatorId) => {
			let editedTranslator = translators.find(
				(translator) => translator._id === translatorId,
			);

			editedTranslator = {
				...editedTranslator,
				suspended: {
					status: !editedTranslator.suspended.status,
					time: getMomentUTC().format(),
				},
			};

			const message = editedTranslator.suspended.status
				? MESSAGES.translatorSuspended
				: MESSAGES.translatorActivated;

			saveChangedTranslator(editedTranslator, message);
		},
		[translators],
	);

	const toggleClientSuspended = async (translatorId, clientId) => {
		await toggleClientSuspendedRequest({ translatorId, clientId });

		const editedTranslator = translators.find(
			(item) => item._id === translatorId,
		);
		let message;

		editedTranslator.clients = editedTranslator.clients.map((client) => {
			if (client._id === clientId) {
				const isSuspended = client.suspendedTranslators.includes(translatorId);
				message = isSuspended
					? MESSAGES.clientActivated
					: MESSAGES.clientSuspended;

				return {
					...client,
					suspendedTranslators: isSuspended
						? client.suspendedTranslators.filter((id) => id !== translatorId)
						: [...client.suspendedTranslators, translatorId],
				};
			} else {
				return client;
			}
		});

		saveChangedTranslator(editedTranslator, message);
	};

	const updateTranslatorEmail = async (email, id, wantsToReceiveEmails) => {
		let editedTranslator = translators.find((item) => item._id === id);
		editedTranslator = {
			...editedTranslator,
			email,
			wantsToReceiveEmails,
		};
		return saveChangedTranslator(
			editedTranslator,
			MESSAGES.translatorEmailUpdated,
		);
	};

	return {
		translators,
		setTranslators,
		startTranslatorDelete,
		dragOverHandler,
		onBoardDrop,
		dragLeaveHandler,
		loading,
		toggleDrawer,
		state,
		dragEndHandler,
		dragStartHandler,
		dragDropHandler,
		translatorsFormSubmit,
		message,
		alertOpen,
		openAlert,
		closeAlert,
		alertStatusConfirmation,
		openAlertConfirmation,
		closeAlertConfirmationNoReload,
		finishTranslatorDelete,
		suspendTranslator,
		toggleClientSuspended,
		changeFilter,
		memoizedFilteredTranslators,
		translatorFilter,
		updateTranslatorEmail,
		mailoutInProgress,
		dollarToUahRate,
	};
};

export const useSingleTranslator = ({ translatorId }) => {
	const [lastVirtualGiftLabel, setLastVirtualGiftLabel] = useState(
		`Last virtual gift was at:`,
	);
	const previousDayDate = getStartOfPreviousDayInUTC();
	const [giftRequestLoader, setGiftRequestLoader] = useState(false);
	const [translatorBalanceDays, setTranslatorBalanceDays] = useState([]);
	const [personalPenalties, setPersonalPenalties] = useState([]);
	const user = useSelector((state) => state.auth.user);
	const fetchBalanceDays = async () => {
		const response = await getBalanceDaysForTranslatorRequest({
			dateTimeFilter: previousDayDate.format(),
			translatorId,
		});
		if (response.status !== 200) {
			throw new Error(MESSAGES.somethingWrongWithBalanceDays);
		}
		return response.body;
	};
	const fetchPenalties = async () => {
		const response = await getPenaltiesForTranslatorRequest({
			dateTimeFilter: getMomentUTC().format(),
			translatorId,
		});
		if (response.status !== 200) {
			throw new Error(MESSAGES.somethingWrongWithBalanceDays);
		}
		return response.body;
	};
	const { isLoading: balanceDaysAreLoading } = useQuery(
		`balanceDaysForTranslator${translatorId}`,
		fetchBalanceDays,
		{
			enabled: !!user,
			onSuccess: (data) => setTranslatorBalanceDays(data),
			onError: () => console.error(MESSAGES.somethingWrongWithBalanceDays),
		},
	);

	const { isLoading: penaltiesAreLoading } = useQuery(
		`penaltiesForTranslator${translatorId}`,
		fetchPenalties,
		{
			enabled: !!user,
			onSuccess: (data) => setPersonalPenalties(data),
			onError: () =>
				console.error(MESSAGES.somethingWentWrongWithPersonalPenalties),
		},
	);

	const calculatePersonalPenalties = () => {
		const thisMonthsPenaltiesArray = [];
		const selectedDatePenaltiesArray = [];
		personalPenalties?.forEach((personalPenalty) => {
			if (
				getMomentUTC(personalPenalty.dateTimeId).isSame(getMomentUTC(), "month")
			) {
				thisMonthsPenaltiesArray.push(personalPenalty);
			}
			if (
				getMomentUTC(personalPenalty.dateTimeId).isSame(previousDayDate, "date")
			) {
				selectedDatePenaltiesArray.push(personalPenalty);
			}
		});

		return thisMonthsPenaltiesArray.length || selectedDatePenaltiesArray.length
			? {
					thisMonthsPenaltiesArray,
					selectedDatePenaltiesArray,
				}
			: null;
	};

	function findYesterdayStatisticObjectForClient(clientId) {
		return translatorBalanceDays.find((balanceDay) => {
			return (
				balanceDay.client === clientId &&
				getMomentUTC(balanceDay.dateTimeId).isSame(
					getMomentUTC().subtract(1, "day").startOf("day"),
					"day",
				)
			);
		});
	}

	function calculateSumByClient(clientId) {
		const balanceDayForCurrentClientForYesterday =
			findYesterdayStatisticObjectForClient(clientId);
		if (!!balanceDayForCurrentClientForYesterday) {
			return calculateBalanceDaySum(
				balanceDayForCurrentClientForYesterday.statistics,
			).toFixed(2);
		}

		return 0;
	}

	function calculateMiddleMonthSum(selectedDate) {
		const sum = [];
		const balanceDaysOfSelectedMonth = translatorBalanceDays.filter(
			({ dateTimeId }) =>
				getMomentUTC(dateTimeId).isSame(selectedDate, "month"),
		);
		balanceDaysOfSelectedMonth.forEach((balanceDay) => {
			sum.push(calculateBalanceDaySum(balanceDay.statistics));
		});
		return getMiddleValueFromArray(sum);
	}

	function getTranslatorsRating() {
		const middle = calculateMiddleMonthSum();

		return middle >= 100
			? 5
			: middle >= 75
				? 4
				: middle >= 50
					? 3
					: middle >= 30
						? 2
						: 1;
	}

	function specialColorNeeded(clientId) {
		const clientObject = findYesterdayStatisticObjectForClient(clientId);

		if (clientObject.virtualGiftsSvadba) {
			return "clients-list__finance-container--pink_text";
		} else if (clientObject.virtualGiftsDating) {
			return "clients-list__finance-container--green_text";
		} else if (clientObject.phoneCalls) {
			return "clients-list__finance-container--blue_text";
		} else if (clientObject.penalties) {
			return "clients-list__finance-container--red_text";
		} else {
			return "";
		}
	}

	function getLastVirtualGiftDate(translatorId) {
		setGiftRequestLoader(true);
		sendLastVirtualGiftDateRequest(translatorId)
			.then((res) => {
				setLastVirtualGiftLabel(res.body ?? "No gifts found");
				setGiftRequestLoader(false);
			})
			.catch((err) => {
				console.log(err?.message);
				setGiftRequestLoader(false);
			});
	}

	return {
		calculateSumByClient,
		specialColorNeeded,
		getTranslatorsRating,
		calculateMiddleMonthSum,
		calculatePersonalPenalties,
		getLastVirtualGiftDate,
		lastVirtualGiftLabel,
		giftRequestLoader,
		dataIsLoading: balanceDaysAreLoading || penaltiesAreLoading,
		translatorBalanceDays,
	};
};
