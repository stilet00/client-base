import { useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import {
	addClient,
	updateClient,
	getClientsOverviewRequest,
} from "services/clientsServices/services";
import Typography from "@mui/material/Typography";
import AlertMessage from "sharedComponents/AlertMessage/AlertMessage";
import { useAlert } from "sharedComponents/AlertMessage/hooks";
import SingleClient from "./SingleClient";
import Grid from "@mui/material/Grid";
import "../../styles/modules/ListOfClients.css";
import ClientsForm from "./ClientsForm/ClientsForm";
import useModal from "../../sharedHooks/useModal";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { faVenus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "sharedComponents/Loader/Loader";
import { getSumFromArray } from "sharedFunctions/sharedFunctions";
import { useAdminStatus } from "sharedHooks/useAdminStatus";
import MESSAGE from "constants/messages";

export default function ListOfClients() {
	const queryClient = useQueryClient();
	const user = useSelector((state) => state.auth.user);
	const [showGraph, setShowGraph] = useState(false);
	const [graphData, setGraphData] = useState(null);
	const [updatingClient, setUpdatingClient] = useState({});
	const inputRef = useRef(null);
	const { handleClose, handleOpen, open } = useModal();
	const [alertInfo, setAlertInfo] = useState({
		mainTitle: "no message had been put",
		status: true,
	});
	const { alertOpen, closeAlert, openAlert } = useAlert();

	const { isLoading: clientsDataIsLoading, data: clientsData } = useQuery(
		"clientsOverview",
		getClientsOverviewRequest,
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
			refetchOnWindowFocus: false,
		},
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

	const isAdmin = useAdminStatus();

	const getUpdatingClient = (_id) =>
		clientsData.find((client) => client._id === _id);

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
		[alertInfo, openAlert, queryClient],
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

	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent form from reloading the page
		const searchQuery = inputRef.current.value; // Access the input value from the ref
		console.log("Searching for:", searchQuery);
		// Perform your search or other logic here
	};

	if (clientsDataIsLoading) {
		return <Loader />;
	}

	return (
		<>
			<Box component="form" onSubmit={handleSubmit}>
				<input
					ref={inputRef}
					className="search-input"
					type="text"
					placeholder="First or last name..."
				/>
				<Button
					variant="contained"
					color="primary"
					sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
					type="submit"
				>
					Search
				</Button>
			</Box>
			<div className={"main-container scrolled-container"}>
				{clientsData?.length > 0 && (
					<Grid container spacing={2} id="on-scroll__rotate-animation-list">
						{clientsData?.map((client) => {
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
				{!clientsData?.length && (
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
