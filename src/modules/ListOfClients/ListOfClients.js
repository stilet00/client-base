import { useState, useCallback, useRef, useMemo } from "react";
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
import { Box, IconButton } from "@mui/material";
import { faTimes, faVenus } from "@fortawesome/free-solid-svg-icons";
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
	const [query, setQuery] = useState("");
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

	const filteredClients = useMemo(() => {
		if (!query) {
			return clientsData;
		}
		return clientsData.filter((client) => {
			return (
				client.name.toLowerCase().includes(query.toLowerCase()) ||
				client.surname.toLowerCase().includes(query.toLowerCase())
			);
		});
	}, [query, clientsData]);

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

	const getUpdatingClient = (_id) => {
		const clientWithFieldsForForm = clientsData.find(
			(client) => client._id === _id,
		);
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
						queryClient.invalidateQueries("clientsOverview");
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
				queryClient.invalidateQueries("clientsOverview");
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

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		const searchQuery = inputRef.current.value;
		setQuery(searchQuery);
	};

	if (clientsDataIsLoading) {
		return <Loader />;
	}

	return (
		<>
			<Box component="form" onSubmit={handleSearchSubmit}>
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
				{query && (
					<IconButton
						type="button"
						onClick={() => {
							setQuery("");
							inputRef.current.value = "";
						}}
					>
						<FontAwesomeIcon icon={faTimes} />
					</IconButton>
				)}
			</Box>
			<div className={"main-container scrolled-container"}>
				{filteredClients?.length > 0 && (
					<Grid container spacing={2} id="on-scroll__rotate-animation-list">
						{filteredClients?.map((client) => {
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
				{!filteredClients?.length && (
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
