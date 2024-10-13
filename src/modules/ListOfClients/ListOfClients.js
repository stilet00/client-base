import { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import {
	getClientsRequest,
	addClient,
	updateClient,
} from "services/clientsServices/services";
import { getPaymentsRequest } from "services/financesStatement/services";
import { getBalanceDaysForClientsRequest } from "services/balanceDayServices/index";
import Typography from "@mui/material/Typography";
import AlertMessage from "sharedComponents/AlertMessage/AlertMessage";
import { useAlert } from "sharedComponents/AlertMessage/hooks";
import SingleClient from "./SingleClient";
import Grid from "@mui/material/Grid";
import "../../styles/modules/ListOfClients.css";
import ClientsForm from "./ClientsForm/ClientsForm";
import useModal from "../../sharedHooks/useModal";
import Button from "@mui/material/Button";
import { faVenus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "sharedComponents/Loader/Loader";
import {
	getClientsRating,
	getMomentUTC,
	calculateBalanceDaySum,
	getSumFromArray,
	getNumberWithHundreds,
	calculatePercentDifference,
} from "sharedFunctions/sharedFunctions";
import { useAdminStatus } from "sharedHooks/useAdminStatus";
import MESSAGE from "constants/messages";
import useSearch from "sharedHooks/useSearchString";
import useDebounce from "sharedHooks/useDebounce";

export default function ListOfClients() {
	const queryClient = useQueryClient();
	const user = useSelector((state) => state.auth.user);
	const [showGraph, setShowGraph] = useState(false);
	const [graphData, setGraphData] = useState(null);
	const [updatingClient, setUpdatingClient] = useState({});
	const { handleClose, handleOpen, open } = useModal();
	const { queryString, changeSearchParams } = useSearch();
	const [alertInfo, setAlertInfo] = useState({
		mainTitle: "no message had been put",
		status: true,
	});
	const { alertOpen, closeAlert, openAlert } = useAlert();

	const fetchClients = useCallback(async () => {
		const response = await getClientsRequest({ shouldFillTranslators: true });
		if (response.status !== 200) {
			throw new Error("Something went wrong with clients data");
		}
		return response.body;
	}, []);

	const fetchBalanceDays = useCallback(async () => {
		const response = await getBalanceDaysForClientsRequest();
		console.log(response);
		if (response.status !== 200) {
			throw new Error("Something went wrong with balance days data");
		}

		return response?.body;
	}, []);

	const { isLoading: clientsAreLoading, data: clients } = useQuery(
		"clientsData",
		fetchClients,
		{
			onError: (error) => {
				setAlertInfo({
					...alertInfo,
					mainTitle: MESSAGE.somethingWrongWithGettingClients,
					status: false,
				});
				openAlert(5000);
			},
			enabled: !!user,
		},
	);

	const { isLoading: balanceDaysAreLoading, data: balanceDays } = useQuery(
		"balanceDaysForClients",
		fetchBalanceDays,
		{
			onError: (error) => {
				setAlertInfo({
					...alertInfo,
					mainTitle: MESSAGE.somethingWrongWithBalanceDays,
					status: false,
				});
				openAlert(5000);
			},
			enabled: !!user,
		},
	);

	const { isLoading: paymentsAreLoading, data: paymentsList } = useQuery(
		"paymentsForClients",
		getPaymentsRequest,
		{
			onError: (error) => {
				const message = error.message;
				setAlertInfo({
					...alertInfo,
					mainTitle: message,
					status: false,
				});
				openAlert(5000);
			},
			enabled: !!user,
		},
	);

	const getTotalProfitPerClient = useCallback(
		(clientId) => {
			const balanceDaysForCurrentClient = balanceDays?.filter(
				(balanceDay) => balanceDay.client === clientId,
			);
			const currentYearBalanceDaysForClient =
				balanceDaysForCurrentClient?.filter(({ dateTimeId }) =>
					getMomentUTC(dateTimeId).isSame(getMomentUTC(), "year"),
				);
			const previousYearBalanceDaysForClient =
				balanceDaysForCurrentClient?.filter(({ dateTimeId }) =>
					getMomentUTC(dateTimeId).isSame(
						getMomentUTC().subtract(1, "year"),
						"year",
					),
				);
			const currentYearProfit = currentYearBalanceDaysForClient?.reduce(
				(sum, current) => {
					return sum + calculateBalanceDaySum(current.statistics);
				},
				0,
			);
			const previousYearProfit = previousYearBalanceDaysForClient?.reduce(
				(sum, current) => {
					return sum + calculateBalanceDaySum(current.statistics);
				},
				0,
			);
			const allYearsProfit = balanceDaysForCurrentClient?.reduce(
				(sum, current) => {
					return sum + calculateBalanceDaySum(current.statistics);
				},
				0,
			);
			const clientsProfit = {
				currentYearProfit,
				allYearsProfit,
				previousYearProfit,
			};
			return clientsProfit;
		},
		[balanceDays],
	);

	const clientMonthSum = useCallback(
		(clientId, monthOffset = 0) => {
			const balanceDaysForCurrentClient = balanceDays?.filter(
				(balanceDay) => balanceDay.client === clientId,
			);

			const balanceDaysForSpecifiedMonth = balanceDaysForCurrentClient?.filter(
				({ dateTimeId }) =>
					getMomentUTC(dateTimeId).isSame(
						getMomentUTC().subtract(monthOffset, "month"),
						"month",
					),
			);

			const specifiedMonthSum = balanceDaysForSpecifiedMonth?.reduce(
				(sum, current) => {
					return sum + calculateBalanceDaySum(current.statistics);
				},
				0,
			);

			return specifiedMonthSum?.toFixed(2);
		},
		[balanceDays],
	);

	const calculateMiddleMonthSum = useCallback(
		(clientId, date = getMomentUTC()) => {
			const totalClientBalanceForCurrentMonth = clientMonthSum(clientId);
			const currentDayOfMinusOne = getMomentUTC().format("D");
			return Math.round(
				totalClientBalanceForCurrentMonth / Number(currentDayOfMinusOne),
			);
		},
		[clientMonthSum],
	);

	const sortBySum = useCallback(
		(clientOne, clientTwo) => {
			const clientOneSum = clientMonthSum(clientOne._id);
			const clientTwoSum = clientMonthSum(clientTwo._id);
			if (clientOneSum > clientTwoSum) {
				return -1;
			} else if (clientOneSum < clientTwoSum) {
				return 1;
			}
			return 0;
		},
		[clientMonthSum],
	);

	function getArrayOfBalancePerDay(clientId, category = null) {
		let currentMonthSum = [];
		let previousMonthSum = [];
		let monthsSum = {
			currentMonth: [],
			previousMonth: [],
		};
		currentMonthSum = currentMonthSum?.map((day) =>
			Math.round(getSumFromArray(day)),
		);
		previousMonthSum = previousMonthSum?.map((day) =>
			Math.round(getSumFromArray(day)),
		);
		monthsSum = {
			...monthsSum,
			currentMonth: currentMonthSum,
			previousMonth: previousMonthSum,
		};
		return monthsSum;
	}

	const getArrayWithAmountsPerDayForPickedMonth = (
		clientId,
		month,
		sumHolder,
		category,
		countUntilThisDateInMonth = getMomentUTC().subtract(1, "day").format("D"),
	) => {
		month.forEach((day, index) => {
			if (index === 0 || index < countUntilThisDateInMonth) {
				const clientBalanceDay = day.clients.find(
					(client) => client.id === clientId,
				);
				if (clientBalanceDay) {
					if (typeof sumHolder[index] === "undefined") {
						sumHolder[index] = [
							getNumberWithHundreds(
								calculateBalanceDaySum(clientBalanceDay, false, category),
							),
						];
					} else {
						sumHolder[index] = [
							...sumHolder[index],
							getNumberWithHundreds(
								calculateBalanceDaySum(clientBalanceDay, false, category),
							),
						];
					}
				}
			}
		});
	};
	const isAdmin = useAdminStatus();

	// useDebounce(
	// 	async () => {
	// 		setLoading(true);
	// 		const responseDataWithClients = await getClientsRequest({
	// 			searchQuery: queryString,
	// 			shouldFillTranslators: true,
	// 		});
	// 		if (responseDataWithClients.status === 200) {
	// 			setClients(responseDataWithClients.body);
	// 		} else {
	// 			setAlertInfo({
	// 				...alertInfo,
	// 				mainTitle: MESSAGE.somethingWrongWithGettingClients,
	// 				status: false,
	// 			});
	// 			openAlert(5000);
	// 		}
	// 		setLoading(false);
	// 	},
	// 	1000,
	// 	[queryString],
	// );

	const getUpdatingClient = (_id) => {
		const clientWithID = clients.find((client) => client._id === _id);
		const clientWithFieldsForForm = {
			_id: clientWithID._id,
			name: clientWithID.name,
			surname: clientWithID.surname,
			bankAccount: clientWithID.bankAccount || "PayPal",
			svadba: {
				login: clientWithID.svadba?.login || "",
				password: clientWithID.svadba?.password || "",
			},
			dating: {
				login: clientWithID.dating?.login || "",
				password: clientWithID.dating?.password || "",
			},
			instagramLink: clientWithID.instagramLink || "",
			image: clientWithID.image || "",
			suspended: !!clientWithID.suspended,
		};
		setUpdatingClient(clientWithFieldsForForm);
		handleOpen();
	};

	const clearEditedClient = () => {
		setUpdatingClient({});
	};

	const editClientData = useCallback(
		(editedClient) => {
			updateClient(editedClient)
				.then((res) => {
					if (res.status === 200) {
						const message = "Client had been successfully updated";
						setAlertInfo({
							...alertInfo,
							mainTitle: message,
							status: true,
						});
						queryClient.invalidateQueries("clientsData");
						openAlert(2000);
					} else {
						throw new Error(`Error: ${res?.status}`);
					}
				})
				.catch((err) => {
					const message = err?.response?.body?.error || "An error occurred";
					setAlertInfo({
						...alertInfo,
						mainTitle: message,
						status: false,
					});
					openAlert();
				});
		},
		[clients, alertInfo, openAlert],
	);

	const addNewClient = async (newClient) => {
		try {
			const responseFromAddedClient = await addClient(newClient);
			if (responseFromAddedClient.status === 200) {
				queryClient.invalidateQueries("clientsData");
				setAlertInfo({
					...alertInfo,
					mainTitle: "client had been added",
					status: true,
				});
				openAlert(2000);
			} else {
				setAlertInfo({
					...alertInfo,
					mainTitle: MESSAGE.somethingWrongWithAddingClient.text,
					status: false,
				});
				openAlert(5000);
			}
		} catch (error) {
			setAlertInfo({
				...alertInfo,
				mainTitle: MESSAGE.somethingWrongWithAddingClient.text,
				status: false,
			});
			openAlert(5000);
		}
	};
	const closeGraph = () => {
		setShowGraph(false);
	};

	const switchToGraph = (argsFromHandleSwitchToGraph) => {
		const { id, category } = argsFromHandleSwitchToGraph;
		const pickedClientSumsPerMonth = getArrayOfBalancePerDay(id, category);
		setGraphData(pickedClientSumsPerMonth);
		setShowGraph(true);
	};

	const sortedClients = useMemo(() => {
		if (!clients) {
			return [];
		}
		return clients.sort(sortBySum);
	}, [clients, sortBySum]);

	const clientProfits = useMemo(() => {
		return sortedClients?.reduce((acc, client) => {
			acc[client._id] = {
				middleMonthSum: calculateMiddleMonthSum(client._id),
				previousMiddleMonthSum: calculateMiddleMonthSum(
					client._id,
					getMomentUTC().subtract(1, "month"),
				),
				monthSum: clientMonthSum(client._id),
				previousMonthSum: clientMonthSum(client._id, 1),
				profit: getTotalProfitPerClient(client._id),
				twoMonthBeforeAmount: clientMonthSum(client._id, 2),
			};
			return acc;
		}, {});
	}, [
		sortedClients,
		calculateMiddleMonthSum,
		getTotalProfitPerClient,
		clientMonthSum,
	]);

	const paymentsByClient = useMemo(() => {
		return paymentsList?.reduce((acc, payment) => {
			if (!acc[payment.receiverID]) {
				acc[payment.receiverID] = [];
			}
			acc[payment.receiverID].push(payment);
			return acc;
		}, {});
	}, [paymentsList]);

	const clientsWithFinanceData = useMemo(() => {
		return sortedClients.map((client) => {
			const profits = clientProfits[client._id];
			const arrayOfPaymentsMadeToClient = paymentsByClient[client._id] || [];
			const spendsOnClient = getSumFromArray(
				arrayOfPaymentsMadeToClient.map((payment) => payment.amount),
			);

			return {
				_id: client._id,
				name: client.name,
				surname: client.surname,
				currentMonthTotalAmount: profits.monthSum,
				translators: client.translators,
				rating: getClientsRating(profits.middleMonthSum),
				bankAccount: client.bankAccount || "PayPal",
				svadba: client.svadba || {},
				dating: client.dating || {},
				instagramLink: `https://www.instagram.com/${client.instagramLink || ""}`,
				loss: spendsOnClient,
				image: client.image ?? null,
				suspended: false,
				currentYearProfit: profits.profit.currentYearProfit,
				absoluteProfit: profits.profit.allYearsProfit,
				previousMonthTotalAmount: profits.previousMonthSum,
				twoMonthBeforeAmount: profits.twoMonthBeforeAmount,
				middleMonthSum: profits.middleMonthSum,
				prevousMiddleMonthSum: profits.previousMiddleMonthSum,
				monthProgressPercent: calculatePercentDifference(
					profits.middleMonthSum,
					profits.previousMiddleMonthSum,
				),
			};
		});
	}, [sortedClients, clientProfits, paymentsByClient]);
	console.log(`clientsWithFinanceData`, clientsWithFinanceData);

	const loading =
		balanceDaysAreLoading || paymentsAreLoading || clientsAreLoading;

	if (loading) {
		console.log(`loading: ${loading}`);
		return <Loader />;
	}

	return (
		<>
			<div>
				<input
					className="search-input"
					type="text"
					placeholder="Search for..."
					value={queryString}
					onChange={(e) => {
						changeSearchParams(e.target.value);
					}}
				/>
			</div>
			<div className={"main-container scrolled-container"}>
				{clientsWithFinanceData?.length > 0 && (
					<Grid container spacing={2} id="on-scroll__rotate-animation-list">
						{clientsWithFinanceData?.map((client) => {
							return (
								<Grid key={client._id} item xs={12} md={4} sm={6}>
									<SingleClient
										{...client}
										handleUpdatingClientsId={getUpdatingClient}
										handleSwitchToGraph={switchToGraph}
									/>
								</Grid>
							);
						})}
					</Grid>
				)}
				{!clientsWithFinanceData?.length && (
					<Typography variant="h5" component="div" style={{ margin: "auto" }}>
						{"No clients found"}
					</Typography>
				)}
			</div>
			<div className="socials button-add-container">
				<Button
					type="button"
					onClick={handleOpen}
					fullWidth
					startIcon={<FontAwesomeIcon icon={faVenus} />}
					disabled={!isAdmin}
				>
					Add client
				</Button>
				<ClientsForm
					editedClient={updatingClient}
					onAddNewClient={addNewClient}
					onEditClientData={editClientData}
					handleClose={handleClose}
					clearEditedClient={clearEditedClient}
					open={open}
				/>
			</div>
			<AlertMessage
				mainText={alertInfo.mainTitle}
				open={alertOpen}
				handleOpen={openAlert}
				handleClose={closeAlert}
				status={alertInfo.status}
			/>
		</>
	);
}
