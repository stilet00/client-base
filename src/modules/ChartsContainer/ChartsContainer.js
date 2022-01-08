import React, { useCallback, useEffect, useState } from "react";
import Header from "../../sharedComponents/Header/Header";
import SingleChart from "./SingleChart/SingleChart";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import {
  addMonth,
  changeChartValue,
  getBalance,
  removeYear,
} from "../../services/balanceServices/services";
import ChartForm from "./ChartForm/ChartForm";
import Loader from "../../sharedComponents/Loader/Loader";
import Unauthorized from "../../sharedComponents/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";
import { useAlertConfirmation } from "../../sharedComponents/AlertMessageConfirmation/hooks";
import AlertMessageConfirmation from "../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation";
import moment from "moment";
import YearSelect from "../../sharedComponents/YearSelect/YearSelect";
function ChartsContainer() {
  const [months, setMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));
  const [deletedMonth, setDeletedMonth] = useState(null);
  const [emptyStatus, setEmptyStatus] = useState(false);
  const [arrayOfYears, setArrayOfYears] = useState([]);
  const { alertOpen, closeAlert, openAlert, closeAlertNoReload } = useAlert();
  const {
    alertStatusConfirmation,
    closeAlertConfirmation,
    openAlertConfirmation,
    closeAlertConfirmationNoReload,
  } = useAlertConfirmation();
  useEffect(() => {
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
    [months]
  );
  const deleteGraphClicked = useCallback(() => {
    removeYear(deletedMonth._id).then((res) => {
      if (res.status === 200) {
        setMonths(months.filter((item) => item._id !== deletedMonth._id));
        setDeletedMonth(null);
        closeAlertConfirmationNoReload();
      }
    });
  }, [deletedMonth, months]);
  const cancelDeleteGraphClicked = useCallback(() => {
    setDeletedMonth(null);
    closeAlertConfirmationNoReload();
  }, []);
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
          setTimeout(closeAlertNoReload, 1500);
        }
      });
    },
    [months]
  );
  const onValueSubmit = useCallback((valueOfDay) => {
    changeChartValue(valueOfDay).then((res) => {
      if (res.status === 200) {
        openAlert();
        setTimeout(closeAlert, 1500);
      }
    });
  }, []);

  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn }) => {
        return isSignedIn ? (
          <>
            <Header />
            <div className={"socials button-add-container middle-button"}>
              <AccessTimeIcon />
              <YearSelect
                arrayOfYears={arrayOfYears}
                year={selectedYear}
                handleChange={handleChange}
              />
            </div>
            <div className={"taskList-container chart-container"}>
              {months.length > 0 ? (
                <ul>
                  {months.map((month, index) => (
                    <SingleChart
                      onValueSubmit={onValueSubmit}
                      graph={month}
                      index={index}
                      key={month._id}
                      deleteGraph={deleteGraph}
                    />
                  ))}
                </ul>
              ) : emptyStatus ? (
                <h1> No data available. </h1>
              ) : (
                <Loader />
              )}
            </div>
            <div className={"socials button-add-container resized-container"}>
              <ChartForm onMonthSubmit={onMonthSubmit} year={selectedYear} />
            </div>
            <AlertMessage
              mainText={"Data has been added!"}
              open={alertOpen}
              handleOpen={openAlert}
              handleClose={closeAlert}
              status={true}
            />
            <AlertMessageConfirmation
              mainText={"Please confirm that you want to delete chart?"}
              additionalText={
                deletedMonth
                  ? `Deleting month: ${moment(
                      `${deletedMonth.year}-${deletedMonth.month}`
                    ).format("MMMM-YYYY")}`
                  : null
              }
              open={alertStatusConfirmation}
              handleClose={closeAlertConfirmation}
              handleOpen={openAlertConfirmation}
              status={false}
              onCancel={cancelDeleteGraphClicked}
              onConfirm={deleteGraphClicked}
            />
          </>
        ) : (
          <Unauthorized />
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default ChartsContainer;
