import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";
import {
  addMonth,
  changeChartValue,
  getBalance,
  removeYear,
} from "../../services/balanceServices/services";
import { useAlertConfirmation } from "../../sharedComponents/AlertMessageConfirmation/hooks";
import useModal from "../../sharedHooks/useModal";

export const useChartsContainer = (user) => {
  const [months, setMonths] = useState([]);

  const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));

  const [deletedMonth, setDeletedMonth] = useState(null);

  const [emptyStatus, setEmptyStatus] = useState(false);

  const [arrayOfYears, setArrayOfYears] = useState([]);

  const { alertOpen, closeAlert, openAlert } = useAlert();

  const {
    alertStatusConfirmation,
    openAlertConfirmation,
    closeAlertConfirmationNoReload,
  } = useAlertConfirmation();

  useEffect(() => {
    if (user) {
      getBalance().then((res) => {
        if (res.status === 200) {
          const yearList = res.data.map((item) => item.year);
          setArrayOfYears([...new Set(yearList.sort((a, b) => a - b))]);
          let filteredArray = res.data
              .filter((item) => item.year === selectedYear)
              .sort(compareNumeric)
              .reverse();
          setMonths(filteredArray);
          setEmptyStatus(filteredArray.length <= 0);
        } else {
          console.log(res.status);
        }
      });
    }
  }, [selectedYear]);

  const handleChange = useCallback((e) => {
    setSelectedYear(e.target.value);
  }, []);

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
    [months, openAlertConfirmation]
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
            [...months, { ...date, _id: res.data }]
              .sort(compareNumeric)
              .reverse()
          );
        }
      });
    },
    [months, openAlert]
  );

  const onValueSubmit = useCallback(
    (valueOfDay) => {
      changeChartValue(valueOfDay).then((res) => {
        if (res.status === 200) {
          openAlert();
        }
      });
    },
    [openAlert]
  );

  return {
    arrayOfYears,
    selectedYear,
    handleChange,
    months,
    onValueSubmit,
    onMonthSubmit,
    deleteGraph,
    emptyStatus,
    alertOpen,
    closeAlert,
    deletedMonth,
    alertStatusConfirmation,
    closeAlertConfirmationNoReload,
    openAlertConfirmation,
    cancelDeleteGraphClicked,
    deleteGraphClicked,
  };
};

export const useSingleChart = ({
  graph,
  index,
  deleteGraph,
  onValueSubmit,
}) => {
  const data = {
    _id: graph._id,
    labels: graph.days || [],
    title: moment(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
    datasets: [
      {
        fill: true,
        backgroundColor: ["rgba(255,255,255,0.7)"],
        borderColor: ["#ffffff"],
        borderWidth: 0.5,
        data: graph.values,
        tension: 0.4,
        borderDash: [5, 2],
        cubicInterpolationMode: "monotone",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        suggestedMin: 0,
        ticks: {
          color: "white",
          beginAtZero: true,
          callback: function (value, index, values) {
            return value + " $.";
          },
        },
      },
      x: {
        ticks: {
          color: "white",
          callback: function (value, index, values) {
            return value + 1 + "." + graph.month;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        color: "white",
        display: true,
        text: moment(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
      },
    },
  };

  function onChartChange(data) {
    let newArray = graph.values;
    newArray[data.selectedDate - 1] = data.value;
    let newGraph = { ...graph, values: newArray };
    onValueSubmit(newGraph);
  }

  return {
    onChartChange,
    index,
    data,
    options,
    graph,
    deleteGraph,
  };
};

export const useChartForm = ({ onMonthSubmit, year }) => {
  const [months, setMonths] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(1);

  const [valuesArray, setValuesArray] = useState([]);

  const { handleClose, handleOpen, open } = useModal();

  useEffect(() => {
    let monthsArray = [];
    for (let i = 1; i < 13; i++) {
      i < 10
        ? monthsArray.push(
            moment("01-0" + i + "-" + year, "DD-MM-YYYY").format("MMMM")
          )
        : monthsArray.push(
            moment("01-" + i + "-" + year, "DD-MM-YYYY").format("MMMM")
          );
    }
    setMonths(monthsArray);
  }, [year]);

  const handleChange = useCallback((event) => {
    setSelectedMonth(event.target.value);
  }, []);

  const getTotalDays = useCallback(() => {
    const stringMonth = selectedMonth < 9 ? "0" + selectedMonth : selectedMonth;
    let totalDays = [];
    for (
      let i = 1;
      i <= moment(year + "-" + stringMonth, "YYYY-MM").daysInMonth();
      i++
    ) {
      totalDays.push(i);
    }
    return totalDays;
  }, [selectedMonth, year]);

  const setDefault = useCallback(() => {
    handleClose();
    let monthsArray = [];
    for (let i = 1; i < 13; i++) {
      i < 10
        ? monthsArray.push(
            moment("01-0" + i + "-" + year, "DD-MM-YYYY").format("MMMM")
          )
        : monthsArray.push(
            moment("01-" + i + "-" + year, "DD-MM-YYYY").format("MMMM")
          );
    }
    setMonths(monthsArray);
    setSelectedMonth(1);
    setValuesArray([]);
  }, [year, handleClose]);

  const onFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let submittedMonth = {
        year: year,
        month: selectedMonth < 10 ? "0" + selectedMonth : String(selectedMonth),
        days: getTotalDays(),
        values: valuesArray,
      };
      onMonthSubmit(submittedMonth);
      setDefault();
    },
    [year, selectedMonth, valuesArray, getTotalDays, onMonthSubmit, setDefault]
  );

  const onValuesSubmit = useCallback((newValuesArray) => {
    setValuesArray(newValuesArray);
  }, []);

  return {
    handleOpen,
    open,
    handleClose,
    onFormSubmit,
    year,
    selectedMonth,
    handleChange,
    months,
    getTotalDays,
    onValuesSubmit,
    valuesArray,
  };
};

export const useChartDateForm = ({ monthData, onValueSubmit }) => {
  const [value, setValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment().format("D"));
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
