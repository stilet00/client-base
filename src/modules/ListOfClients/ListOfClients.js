import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
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
import moment from "moment";
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
import { useAdminStatus } from "../../sharedHooks/useAdminStatus";
import MESSAGE from "constants/messages";
import useSearch from "sharedHooks/useSearchString";
import useDebounce from "sharedHooks/useDebounce";

export default function ListOfClients() {
	const user = useSelector((state) => state.auth.user);
	const [paymentsList, setPaymentsList] = useState([]);
	const [showGraph, setShowGraph] = useState(false);
	const [clients, setClients] = useState([]);
	const [balanceDays, setBalanceDays] = useState([]);
	const [graphData, setGraphData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [updatingClient, setUpdatingClient] = useState({});
	const { handleClose, handleOpen, open } = useModal();
	const { queryString, changeSearchParams } = useSearch();
	const [alertInfo, setAlertInfo] = useState({
		mainTitle: "no message had been put",
		status: true,
	});
	const { alertOpen, closeAlert, openAlert } = useAlert();

	const getTotalProfitPerClient = (clientId) => {
		const balanceDaysForCurrentClient = balanceDays.filter(
			(balanceDay) => balanceDay.client === clientId,
		);
		const currentYearBalanceDaysForClient = balanceDaysForCurrentClient.filter(
			({ dateTimeId }) =>
				getMomentUTC(dateTimeId).isSame(getMomentUTC(), "year"),
		);
		const previousYearBalanceDaysForClient = balanceDaysForCurrentClient.filter(
			({ dateTimeId }) =>
				getMomentUTC(dateTimeId).isSame(
					getMomentUTC().subtract(1, "year"),
					"year",
				),
		);
		const currentYearProfit = currentYearBalanceDaysForClient.reduce(
			(sum, current) => {
				return sum + calculateBalanceDaySum(current.statistics);
			},
			0,
		);
		const previousYearProfit = previousYearBalanceDaysForClient.reduce(
			(sum, current) => {
				return sum + calculateBalanceDaySum(current.statistics);
			},
			0,
		);
		const allYearsProfit = balanceDaysForCurrentClient.reduce(
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
	};

	function clientMonthSum(clientId) {
		const balanceDaysForCurrentClient = balanceDays.filter(
			(balanceDay) => balanceDay.client === clientId,
		);
		const balanceDaysForCurrentMonth = balanceDaysForCurrentClient.filter(
			({ dateTimeId }) =>
				getMomentUTC(dateTimeId).isSame(getMomentUTC(), "month"),
		);
		const currentMonthSum = balanceDaysForCurrentMonth.reduce(
			(sum, current) => {
				return sum + calculateBalanceDaySum(current.statistics);
			},
			0,
		);
		return currentMonthSum.toFixed(2);
	}

	function calculateMiddleMonthSum(clientId, date = getMomentUTC()) {
		const totalClientBalanceForCurrentMonth = clientMonthSum(clientId);
		const currentDayOfMinusOne = getMomentUTC().format("D");
		return Math.round(
			totalClientBalanceForCurrentMonth / Number(currentDayOfMinusOne),
		);
	}

	function sortBySum(clientOne, clientTwo) {
		const clientOneSum = clientMonthSum(clientOne._id);
		const clientTwoSum = clientMonthSum(clientTwo._id);
		if (clientOneSum > clientTwoSum) {
			return -1;
		} else if (clientOneSum < clientTwoSum) {
			return 1;
		}
		return 0;
	}

	function getArrayOfBalancePerDay(clientId, category = null) {
		let currentMonthSum = [];
		let previousMonthSum = [];
		let monthsSum = {
			currentMonth: [],
			previousMonth: [],
		};
		currentMonthSum = currentMonthSum.map((day) =>
			Math.round(getSumFromArray(day)),
		);
		previousMonthSum = previousMonthSum.map((day) =>
			Math.round(getSumFromArray(day)),
		);

		return (monthsSum = {
			...monthsSum,
			currentMonth: currentMonthSum,
			previousMonth: previousMonthSum,
		});
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
	const { isAdmin } = useAdminStatus(user);

	const { isLoading: clientsAreLoading } = useQuery(
		"clientsData",
		() => getClientsRequest({ shouldFillTranslators: true }),
		{
			onSuccess: (response) => {
				setClients(response?.data);
			},
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

	const { isLoading: balanceDaysAreLoading } = useQuery(
		"balanceDaysForClients",
		getBalanceDaysForClientsRequest,
		{
			onSuccess: (response) => {
				setBalanceDays(response?.data);
			},
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

	const { isLoading: paymentsAreLoading } = useQuery(
		"paymentsForClients",
		getPaymentsRequest,
		{
			onSuccess: (response) => {
				setPaymentsList(response?.data);
			},
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

	useEffect(() => {
		if (!balanceDaysAreLoading && !paymentsAreLoading && !clientsAreLoading) {
			setLoading(false);
		}
	}, [balanceDaysAreLoading, paymentsAreLoading, clientsAreLoading]);

	useDebounce(
		async () => {
			setLoading(true);
			const responseDataWithClients = await getClientsRequest({
				searchQuery: queryString,
				shouldFillTranslators: true,
			});
			if (responseDataWithClients.status === 200) {
				setClients(responseDataWithClients.data);
			} else {
				setAlertInfo({
					...alertInfo,
					mainTitle: MESSAGE.somethingWrongWithGettingClients,
					status: false,
				});
				openAlert(5000);
			}
			setLoading(false);
		},
		1000,
		[queryString],
	);

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
						setClients(
							clients.map((item) => {
								return item._id === editedClient._id ? editedClient : item;
							}),
						);
						openAlert(2000);
					} else {
						throw new Error(`Error: ${res?.status}`);
					}
				})
				.catch((err) => {
					const message = err?.response?.data?.error || "An error occurred";
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
				setClients([
					...clients,
					{ ...newClient, _id: responseFromAddedClient.data },
				]);
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
				></input>
			</div>
			<div className={"main-container scrolled-container"}>
				{loading && <Loader />}
				{!loading && (
					<>
						{/* <ClientsChartsContainer
                            user={user}
                            values={graphData}
                            open={showGraph}
                            handleClose={closeGraph}
                        /> */}
						{clients?.length > 0 && (
							<Grid container spacing={2} id="on-scroll__rotate-animation-list">
								{clients.sort(sortBySum).map((client) => {
									const memorizedMiddleMonthSum = calculateMiddleMonthSum(
										client._id,
									);
									const memorizedPreviousMiddleMonthSum =
										calculateMiddleMonthSum(
											client._id,
											getMomentUTC().subtract(1, "month"),
										);
									const memorizedMonthSum = clientMonthSum(client._id);
									const memorizedPreviousMonthSum = clientMonthSum(
										client._id,
										getMomentUTC().subtract(1, "month"),
									);
									const arrayOfPaymentsMadeToClient = paymentsList.filter(
										(payment) =>
											payment.receiverID === client._id &&
											payment.date.substring(6, 10) ===
												getMomentUTC().format("YYYY"),
									);
									const getArrayOfPaymentsMadeToClientWithAmounts =
										arrayOfPaymentsMadeToClient.map(
											(payment) => payment.amount,
										);
									const spendsOnClient = getSumFromArray(
										getArrayOfPaymentsMadeToClientWithAmounts,
									);

									const clientProfit = getTotalProfitPerClient(client._id);
									const clientWithPersonalAndFinancialData = {
										_id: client._id,
										name: client.name,
										surname: client.surname,
										currentMonthTotalAmount: memorizedMonthSum,
										translators: client.translators,
										rating: getClientsRating(memorizedMiddleMonthSum),
										bankAccount: client.bankAccount || "PayPal",
										svadba: {
											login: client.svadba?.login || "",
											password: client.svadba?.password || "",
										},
										dating: {
											login: client.dating?.login || "",
											password: client.dating?.password || "",
										},
										instagramLink:
											"https://www.instagram.com/" + client.instagramLink ||
											"https://www.instagram.com/",
										loss: spendsOnClient,
										image: client.image ?? null,
										suspended: false,
										currentYearProfit: clientProfit.currentYearProfit,
										absoluteProfit: clientProfit.allYearsProfit,
										previousMonthTotalAmount: memorizedPreviousMonthSum,
										middleMonthSum: memorizedMiddleMonthSum,
										prevousMiddleMonthSum: memorizedPreviousMiddleMonthSum,
										monthProgressPercent: calculatePercentDifference(
											memorizedMiddleMonthSum,
											memorizedPreviousMiddleMonthSum,
										),
									};
									return (
										<Grid
											key={clientWithPersonalAndFinancialData._id}
											item
											xs={12}
											md={4}
											sm={6}
										>
											<SingleClient
												{...clientWithPersonalAndFinancialData}
												admin={isAdmin}
												handleUpdatingClientsId={getUpdatingClient}
												handleSwitchToGraph={switchToGraph}
											/>
										</Grid>
									);
								})}
							</Grid>
						)}
						{!clients?.length && (
							<Typography
								variant="h5"
								component="div"
								style={{ margin: "auto" }}
							>{`No clients found`}</Typography>
						)}
					</>
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
