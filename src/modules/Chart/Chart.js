import React, { useEffect, useState } from "react";
import "./Chart.css";
import Header from "../../shared/Header/Header";
import SmallChart from "./SmallChart/SmallChart";
import {
  addMonth,
  changeChartValue,
  getBalance,
  removeYear,
} from "../../services/balanceServices/services";
import ChartForm from "./ChartForm/ChartForm";
import Loader from "../../shared/Loader/Loader";
import Unauthorized from "../../shared/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AlertMessage from "../../shared/AlertMessage/AlertMessage";
import { useAlert } from "../../shared/AlertMessage/hooks";
import { useAlertConfirmation } from "../../shared/AlertMessageConfirmation/hooks";
import AlertMessageConfirmation from "../../shared/AlertMessageConfirmation/AlertMessageConfirmation";
import moment from "moment";
function Chart(props) {
  const [months, setMonths] = useState([]);
  const { alertOpen, closeAlert, openAlert, closeAlertNoReload } = useAlert();
  const {alertStatusConfirmation, closeAlertConfirmation, openAlertConfirmation, closeAlertConfirmationNoReload } = useAlertConfirmation();
  const [deletedMonth, setDeletedMonth] = useState(null);
  function compareNumeric(a, b) {
    if (a.month > b.month) return 1;
    if (a.month === b.month) return 0;
    if (a.month < b.month) return -1;
  }

  useEffect(() => {
    getBalance().then((res) => {
      if (res.status === 200) {
        setMonths(res.data.sort(compareNumeric).reverse());
      }
    });
  }, []);
  function deleteGraph(id) {
    setDeletedMonth(months.find(item => item._id === id));
    openAlertConfirmation();

  }
  function deleteGraphClicked() {
    console.log(moment(`${deletedMonth.year}-${deletedMonth.month}`).format("MMMM-YYYY"))
    console.log(deletedMonth)
    removeYear(deletedMonth._id).then((res) => {
          setMonths(months.filter((item) => item._id !== deletedMonth._id))
          setDeletedMonth(null);
          closeAlertConfirmationNoReload();
    }
    );
  }
  function cancelDeleteGraphClicked() {
    setDeletedMonth(null);
    closeAlertConfirmationNoReload();
  }
  function onMonthSubmit(date) {
    addMonth(date).then((res) => {
      if (res.status === 200) {
        openAlert();
        setMonths([...months, {...date, _id: res.data}].sort(compareNumeric).reverse())
        setTimeout(closeAlertNoReload, 1500);
      }
    });
  }
  function onValueSubmit(valueOfDay) {
    changeChartValue(valueOfDay).then((res) => {
      if (res.status === 200) {
        openAlert();
        setTimeout(closeAlert, 1500);
        // setMonths(
        //   months.map((item) =>
        //     item._id === valueOfDay._id ? valueOfDay : item
        //   )
        // );
        // window.location.reload();
      }
    });
  }
  const page = !months.length ? (
    <Loader />
  ) : (
    <ul>
      {months.map((month, index) => (
        <SmallChart
          onValueSubmit={onValueSubmit}
          graph={month}
          index={index}
          key={month._id}
          deleteGraph={deleteGraph}
        />
      ))}
    </ul>
  );
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return isSignedIn ? (
          <>
            <Header />
            <div className={"taskList-container chart-container"}>
              {page}
            </div>
            <div className={"socials button-add-container"}>
              <ChartForm onMonthSubmit={onMonthSubmit} />
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
                additionalText={ deletedMonth ? `Deleting month: ${moment(`${deletedMonth.year}-${deletedMonth.month}`).format("MMMM-YYYY")}` : null}
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

export default Chart;
