import React, { useState, useEffect } from "react";
import Header from "../../shared/Header/Header";
import { getBalance } from "../../services/balanceServices/services";
import { getClients } from "../../services/clientsServices/services";
import moment from "moment";
import "./Overview.css";
import { getTranslators } from "../../services/translatorsServices/services";
import SmallLoader from "../../shared/SmallLoader/SmallLoader";
import Unauthorized from "../../shared/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Loader from "../../shared/Loader/Loader";

function Overview() {
  const [charts, setCharts] = useState([]);
  const [clients, setClients] = useState([]);
  const [translators, setTranslators] = useState([]);
  const [progressStatus, setProgressStatus] = useState(true);
  const [progressValue, setProgressValue] = useState(null);
  const [yearSum, setYearSum] = useState(null);
  const [bestMonth, setBestMonth] = useState(null);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [emptyStatus, setEmptyStatus] = useState(false);
  const handleChange = (event) => {
    setYear(event.target.value);
  };
  useEffect(() => {
    getBalance().then((res) => {
      if (res.status === 200) {
        let byYearFiltredArray = res.data.filter((item) => item.year === year);
        setEmptyStatus(byYearFiltredArray >= 0);
        let sumSortedArray =
          getArrayWithSums(byYearFiltredArray).sort(compareSums);
        setBestMonth(sumSortedArray[sumSortedArray.length - 1]);
        setCharts(byYearFiltredArray);
        getMonthProgress(byYearFiltredArray);
        getYearSum(byYearFiltredArray);
      }
    });
  }, [year]);
  useEffect(() => {
    getClients().then((res) => {
      if (res.status === 200) {
        setClients(res.data);
      }
    });
  }, []);
  useEffect(() => {
    getTranslators().then((res) => {
      if (res.status === 200) {
        setTranslators(res.data);
      }
    });
  }, []);
  function getArrayWithSums(array) {
    return array.map((item) => {
      return { ...item, values: reduceArray(item.values) };
    });
  }
  function compareSums(a, b) {
    return a.values - b.values;
  }
  function reduceArray(array) {
    return array.length > 0
      ? array.reduce((sum, current) => {
          return Number(sum) + Number(current);
        })
      : null;
  }

  function getSumTillNow(array, forFullMonth = false) {
    let sum = 0;
    if (forFullMonth) {
      array?.values.forEach((item) => {
        sum = item ? sum + Number(item) : sum;
      });
    } else {
      if (array) {
        const dayNumber = Number(moment().format("DD"));
        if (dayNumber !== 1) {
          array.values.forEach((item, index) => {
            if (index < dayNumber - 1 && item) {
              sum = sum + Number(item);
            }
          });
        } else {
          array.values.forEach((item, index) => {
            if (index < dayNumber && item) {
              sum = sum + Number(item);
            }
          });
        }
      }
    }
    return sum;
  }
  function getYearSum(yearArray) {
    let arrayOfSums = [];
    yearArray.forEach((item) => {
      arrayOfSums.push(reduceArray(item.values));
    });
    setYearSum(reduceArray(arrayOfSums));
  }
  function getMonthProgress(yearArray) {
    let currentMonth = yearArray.find(
      (item) => item.month === moment().format("MM")
    );

    let previousMonthNumber =
      Number(moment().format("MM")) - 1 < 10
        ? "0" + (Number(moment().format("MM")) - 1)
        : moment().format("MM") - 1 + "";
    let previousMonth = yearArray.find(
      (item) => item.month === previousMonthNumber
    );
    if (!currentMonth) {
      currentMonth = yearArray[yearArray.length - 1];
      previousMonth = yearArray[yearArray.length - 2];
      let currentSum = getSumTillNow(currentMonth, true);
      let previousSum = getSumTillNow(previousMonth, true);
      if (currentSum > previousSum) {
        setProgressValue(
          Math.round(((currentSum - previousSum) * 100) / currentSum)
        );
      } else {
        setProgressStatus(false);
        setProgressValue(
          Math.round(((previousSum - currentSum) * 100) / previousSum)
        );
      }
    } else {
      let currentSum = getSumTillNow(currentMonth);
      let previousSum = getSumTillNow(previousMonth);
      if (currentSum > previousSum) {
        setProgressValue(
          Math.round(((currentSum - previousSum) * 100) / currentSum)
        );
      } else if (currentSum !== 0 && previousSum !== 0) {
        setProgressStatus(false);
        setProgressValue(
          Math.round(((previousSum - currentSum) * 100) / previousSum)
        );
      } else {
        setProgressStatus(false);
        setProgressValue(0);
      }
    }
  }

  let monthProgressPage =
    progressValue || progressValue === 0 ? (
      progressStatus ? (
        <span className={"green-text"}> + {progressValue} %</span>
      ) : (
        <span className={"red-text"}> - {progressValue} %</span>
      )
    ) : (
      <SmallLoader />
    );
  let yearSumPage = yearSum ? yearSum + " $" : <SmallLoader />;
  let salaryPage = yearSum ? (
    <span style={{ color: "orange" }}>
      {" "}
      {Math.floor(yearSum * 0.45) + " $"}{" "}
    </span>
  ) : (
    <SmallLoader />
  );
  let clientsPaymentPage = yearSum ? (
    <span style={{ color: "orange" }}>
      {" "}
      {Math.floor(yearSum * 0.1) + " $"}{" "}
    </span>
  ) : (
    <SmallLoader />
  );
  let profitPage = yearSum ? (
    <span className={"green-text"}>
      {" "}
      {yearSum -
        Math.floor(yearSum * 0.4) -
        Math.floor(yearSum * 0.1) +
        " $"}{" "}
    </span>
  ) : (
    <SmallLoader />
  );

  let bestMonthPage = bestMonth ? (
    <span>
      {`${moment(`${year}-${bestMonth.month}-01`).format("MMM")} : `}
      <b className={"green-text"}>{bestMonth.values + " $"}</b>
    </span>
  ) : (
    <SmallLoader />
  );
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return isSignedIn ? (
          <>
            <Header />
            <div className={"socials button-add-container middle-button"}>
              <AccessTimeIcon />
              <select
                onChange={handleChange}
                className={"year-select-menu"}
                defaultValue={year}
              >
                <option value={"2020"}>2020</option>
                <option value={"2021"} selected>
                  2021
                </option>
                <option value={"2022"}>2022</option>
              </select>
            </div>
            <div
              className={"taskList-container chart-container table-container"}
            >
              <h1>Agency statistics</h1>
              {charts.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Statistic's type</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {year === moment().format("YYYY") ? (
                      <>
                        <tr>
                          <td>Current month</td>
                          <td>
                            <b>{moment().format("MMMM YYYY")}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Month progress</td>
                          <td>
                            <b>{monthProgressPage}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Total clients</td>
                          <td>
                            <b>
                              {clients.length ? (
                                clients.length
                              ) : (
                                <SmallLoader />
                              )}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Total translators</td>
                          <td>
                            <b>
                              {translators.length ? (
                                translators.length
                              ) : (
                                <SmallLoader />
                              )}
                            </b>
                          </td>
                        </tr>
                      </>
                    ) : null}

                    <tr>
                      <td>Best month of {moment(year).format("YYYY")}</td>
                      <td>
                        <b>{bestMonthPage}</b>
                      </td>
                    </tr>

                    <tr>
                      <td>Year's balance</td>
                      <td>
                        <b>{yearSumPage}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Salary payed</td>
                      <td>
                        <b>{salaryPage}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Payments to clients</td>
                      <td>
                        <b>{clientsPaymentPage}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Total profit</td>
                      <td>
                        <b>{profitPage}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : emptyStatus ? <h1>No data available.</h1>
               : <Loader /> }
            </div>
          </>
        ) : (
          <Unauthorized />
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default Overview;
