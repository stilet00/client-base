import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";
import {
	addMonth,
	changeChartValue,
	removeYear,
} from "../../services/balanceServices/services";
import { useAlertConfirmation } from "../../sharedComponents/AlertMessageConfirmation/hooks";
import useModal from "../../sharedHooks/useModal";
import {
	getNumberWithHundreds,
	calculateBalanceDaySum,
	getMomentUTC,
} from "sharedFunctions/sharedFunctions";
import { useQuery } from "react-query";
import { getBalanceDaysForChartsRequest } from "services/balanceDayServices/index";
import {
	currentYear,
	currentMonth,
	previousMonth,
	DEFAULT_MONTH_CHART,
	previousDay,
} from "../../constants/constants";
import MESSAGES from "constants/messages";

export const useChartsContainer = (user) => {
	const [months, setMonths] = useState([]);
	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [deletedMonth, setDeletedMonth] = useState(null);
	const [arrayOfYears, setArrayOfYears] = useState([]);
	const [category, setCategory] = useState(null);
	const { alertOpen, closeAlert, openAlert } = useAlert();

	const {
		alertStatusConfirmation,
		openAlertConfirmation,
		closeAlertConfirmationNoReload,
	} = useAlertConfirmation();

	const fetchBalanceDays = async () => {
		const response = await getBalanceDaysForChartsRequest({
			yearFilter: selectedYear,
			monthFilter: `${previousMonth}-${currentMonth}`,
		});
		if (response.status !== 200) {
			throw new Error(MESSAGES.somethingWrongWithBalanceDays);
		}
		return response.body;
	};

	const {
		data,
		isLoading: balanceDaysAreLoading,
		refetch: refetchBalanceDays,
	} = useQuery("balanceDaysForCharts", fetchBalanceDays, {
		enabled: !!user,
		onSuccess: (data) => {
			const yearChartsArray = [];
			for (let monthCount = 1; monthCount < 13; monthCount++) {
				const defaultMonth = new DEFAULT_MONTH_CHART(selectedYear, monthCount);

				const stringMonth = defaultMonth.month;
				const daysInMonth = moment(selectedYear + "-" + stringMonth, "YYYY-MM")
					.hours(12)
					.utc()
					.daysInMonth();
				for (let dayCount = 1; dayCount <= daysInMonth; dayCount++) {
					const currentDayDate = moment(
						`${dayCount}-${monthCount}-${selectedYear}`,
						"D-M-YYYY",
					)
						.hours(12)
						.utc()
						.format();
					const arrayOfBalanceDayForCurrentDate = data.filter((balanceDay) =>
						getMomentUTC(balanceDay.dateTimeId).isSame(currentDayDate, "day"),
					);
					const daySum = arrayOfBalanceDayForCurrentDate.reduce(
						(sum, current) => {
							return sum + calculateBalanceDaySum(current.statistics);
						},
						0,
					);
					if (daySum) {
						defaultMonth.values[dayCount - 1] = getNumberWithHundreds(daySum);
					}
				}
				if (
					defaultMonth.values.reduce((sum, current) => {
						return sum + Number(current);
					}, 0)
				) {
					yearChartsArray.unshift(defaultMonth);
				}
			}
			setMonths(yearChartsArray);
		},
		onError: () => console.error(MESSAGES.somethingWrongWithBalanceDays),
	});
	useEffect(() => {
		refetchBalanceDays();
	}, [selectedYear]);

	const handleChange = (e) => {
		setSelectedYear(e.target.value);
	};

	function compareNumeric(a, b) {
		if (a.month > b.month) return 1;
		if (a.month === b.month) return 0;
		if (a.month < b.month) return -1;
	}
	const deleteGraph = useCallback(
		(id) => {
			setDeletedMonth(months.find((item) => item._id === id));
			openAlertConfirmation();
		},
		[months, openAlertConfirmation],
	);
	const deleteGraphClicked = useCallback(() => {
		removeYear(deletedMonth._id).then((res) => {
			if (res.status === 200) {
				setMonths(months.filter((item) => item._id !== deletedMonth._id));
				setDeletedMonth(null);
				closeAlertConfirmationNoReload();
			}
		});
	}, [deletedMonth, months, closeAlertConfirmationNoReload]);

	const cancelDeleteGraphClicked = useCallback(() => {
		setDeletedMonth(null);
		closeAlertConfirmationNoReload();
	}, [closeAlertConfirmationNoReload]);

	const onMonthSubmit = useCallback(
		(date) => {
			addMonth(date).then((res) => {
				if (res.status === 200) {
					openAlert();
					setMonths(
						[...months, { ...date, _id: res.body }]
							.sort(compareNumeric)
							.reverse(),
					);
				}
			});
		},
		[months, openAlert],
	);
	const onValueSubmit = useCallback(
		(valueOfDay) => {
			changeChartValue(valueOfDay).then((res) => {
				if (res.status === 200) {
					openAlert();
				}
			});
		},
		[openAlert],
	);

	return {
		arrayOfYears,
		selectedYear,
		handleChange,
		months,
		onValueSubmit,
		onMonthSubmit,
		deleteGraph,
		alertOpen,
		closeAlert,
		deletedMonth,
		alertStatusConfirmation,
		closeAlertConfirmationNoReload,
		openAlertConfirmation,
		cancelDeleteGraphClicked,
		deleteGraphClicked,
		category,
		setCategory,
		balanceDaysAreLoading,
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
