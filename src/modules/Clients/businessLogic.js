import { useCallback, useState } from "react";
import { DEFAULT_CLIENT } from "../../constants/constants";
import useModal from "../../sharedHooks/useModal";
import {
	calculateBalanceDaySum,
	getMiddleValueFromArray,
	getSumFromArray,
	getNumberWithHundreds,
	getMomentUTC,
} from "sharedFunctions/sharedFunctions";

export const useClientsForm = ({ onFormSubmit, editedClient }) => {
	const [client, setClient] = useState(editedClient || DEFAULT_CLIENT);

	const { handleClose, handleOpen, open } = useModal();

	const handleChange = useCallback(
		(e) => {
			setClient({ ...client, [e.target.name]: e.target.value.trim() });
		},
		[client],
	);

	function clearClient() {
		setClient(DEFAULT_CLIENT);
	}

	return {
		handleOpen,
		open,
		client,
		clearClient,
		handleClose,
		onFormSubmit,
		handleChange,
	};
};

export const useClientsList = (translators) => {
	function clientMonthSum(clientId, date = getMomentUTC()) {
		let totalClientBalance = 0;

		translators.forEach((translator) => {
			const thisYearStat = translator?.statistics?.find(
				(year) => year.year === date.format("YYYY"),
			);

			const thisMonthStat = thisYearStat?.months[date.format("M") - 1];

			thisMonthStat?.forEach((day) => {
				const clientBalanceDay = day.clients.find(
					(client) => client.id === clientId,
				);
				if (clientBalanceDay) {
					totalClientBalance =
						totalClientBalance + calculateBalanceDaySum(clientBalanceDay);
				}
			});
		});

		return getNumberWithHundreds(totalClientBalance);
	}

	function getAllAssignedTranslators(clientId, date = getMomentUTC()) {
		let arrayOfTranslators = [];

		translators.forEach(({ name, surname, clients, suspended }) => {
			const assignedClient = clients.find((client) => client._id === clientId);
			if (assignedClient && "suspended" in assignedClient) {
				if (!assignedClient.suspended && !suspended.status) {
					arrayOfTranslators.push(`${name} ${surname}`);
				}
			} else if (assignedClient && !("suspended" in assignedClient)) {
				if (!suspended.status) {
					arrayOfTranslators.push(`${name} ${surname}`);
				}
			}
		});
		return arrayOfTranslators;
	}

	function calculateMiddleMonthSum(clientId, date = getMomentUTC()) {
		let monthSumArray = [];

		let totalClientBalance = 0;

		translators.forEach((translator) => {
			const thisYearStat = translator?.statistics?.find(
				(year) => year.year === date.format("YYYY"),
			);

			const thisMonthStat = thisYearStat?.months[date.format("M") - 1];

			thisMonthStat?.forEach((day, index) => {
				if (index === 0 || index < getMomentUTC().format("D")) {
					const clientBalanceDay = day.clients.find(
						(client) => client.id === clientId,
					);

					if (clientBalanceDay) {
						if (typeof monthSumArray[index] === "undefined") {
							const dayArray = [];
							monthSumArray[index] = [
								...dayArray,
								getNumberWithHundreds(calculateBalanceDaySum(clientBalanceDay)),
							];
						} else {
							monthSumArray[index] = [
								...monthSumArray[index],
								getNumberWithHundreds(calculateBalanceDaySum(clientBalanceDay)),
							];
						}
						totalClientBalance =
							totalClientBalance + calculateBalanceDaySum(clientBalanceDay);
					}
				}
			});
		});

		monthSumArray = monthSumArray.map((day) => getSumFromArray(day));

		return Math.round(getMiddleValueFromArray(monthSumArray));
	}

	function sortBySum(clientOne, clientTwo) {
		return clientMonthSum(clientOne._id) < clientMonthSum(clientTwo._id)
			? 1
			: -1;
	}

	return {
		clientMonthSum,
		sortBySum,
		calculateMiddleMonthSum,
		getAllAssignedTranslators,
	};
};
