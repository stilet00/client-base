import { useCallback, useEffect, useState } from "react";
import useModal from "../../sharedHooks/useModal";
import { useQuery } from "react-query";
import { getChartsRequest } from "services/chartServices";
import { useSelector } from "react-redux";
import {
	currentYear,
	currentMonth,
	previousMonth,
	previousDay,
} from "../../constants/constants";
import MESSAGES from "constants/messages";

export const useChartsContainer = () => {
	const user = useSelector((state) => state.auth.user);
	const [selectedYear, setSelectedYear] = useState(currentYear);

	const fetchChartData = async () => {
		const response = await getChartsRequest({
			yearFilter: selectedYear,
			monthFilter: `${previousMonth}-${currentMonth}`,
		});
		if (response.status !== 200) {
			throw new Error(MESSAGES.somethingWrongWithBalanceDays);
		}
		return response.body;
	};

	const {
		data: chartsData,
		isLoading,
		refetch,
	} = useQuery("chartsData", fetchChartData, {
		enabled: !!user,
		onError: () => console.error(MESSAGES.somethingWrongWithBalanceDays),
	});

	useEffect(() => {
		refetch();
	}, [selectedYear]);

	const handleChange = (e) => {
		setSelectedYear(e.target.value);
	};

	return {
		selectedYear,
		handleChange,
		chartsData,
		isLoading,
	};
};

export const useChartDateForm = ({ monthData, onValueSubmit }) => {
	const [value, setValue] = useState("");
	const [selectedDate, setSelectedDate] = useState(previousDay);
	const { handleClose, handleOpen, open } = useModal();

	const handleChange = useCallback((event) => {
		setSelectedDate(event.target.value);
	}, []);

	const onInputChange = useCallback((e) => {
		setValue(e.target.value);
	}, []);

	const onSubmit = (e) => {
		e.preventDefault();
		onValueSubmit({ selectedDate, value, id: monthData._id });
		handleClose();
	};

	return {
		handleOpen,
		open,
		handleClose,
		onSubmit,
		selectedDate,
		handleChange,
		value,
		onInputChange,
		monthData,
	};
};
