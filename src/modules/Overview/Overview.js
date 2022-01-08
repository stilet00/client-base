import React, { useState, useEffect, useCallback } from "react";
import Header from "../../sharedComponents/Header/Header";
import { getBalance } from "../../services/balanceServices/services";
import { getClients } from "../../services/clientsServices/services";
import moment from "moment";
import "../../styles/modules/Overview.css";
import { getTranslators } from "../../services/translatorsServices/services";
import SmallLoader from "../../sharedComponents/SmallLoader/SmallLoader";
import Unauthorized from "../../sharedComponents/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import YearSelect from "../../sharedComponents/YearSelect/YearSelect";

function Overview() {
  const [clients, setClients] = useState([]);
  const [translators, setTranslators] = useState([]);
  const [progressStatus, setProgressStatus] = useState(true);
  const [progressValue, setProgressValue] = useState(null);
  const [yearSum, setYearSum] = useState(null);
  const [bestMonth, setBestMonth] = useState(null);
  const [arrayOfYears, setArrayOfYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));

  const handleChange = useCallback((event) => {
    setSelectedYear(event.target.value);
  }, []);
  useEffect(() => {
    getBalance().then((res) => {
      if (res.status === 200) {
        const yearList = res.data.map((item) => item.year);
        setArrayOfYears([...new Set(yearList.sort((a, b) => a - b))]);
        let byYearFilteredArray = res.data.filter(
          (item) => item.year === selectedYear
        );
        let sumSortedArray =
          getArrayWithSums(byYearFilteredArray).sort(compareSums);
        setBestMonth(sumSortedArray[sumSortedArray.length - 1]);
        getMonthProgress(byYearFilteredArray);
        getYearSum(byYearFilteredArray);
      }
    });
  }, [selectedYear]);
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
        setProgressStatus(true);
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
        setProgressStatus(true);
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
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
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
            <div
              className={"taskList-container chart-container table-container"}
            >
              <h1>Agency statistics</h1>
              <table>
                <thead>
                  <tr>
                    <th>Statistic's type</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedYear === moment().format("YYYY") ? (
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
                            {clients.length ? clients.length : <SmallLoader />}
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
                    <td>Best month of {moment(selectedYear).format("YYYY")}</td>
                    <td>
                      <b>
                        {bestMonth ? (
                          <span>
                            {`${moment(
                              `${selectedYear}-${bestMonth.month}-01`
                            ).format("MMM")} : `}
                            <b className={"green-text"}>
                              {bestMonth.values + " $"}
                            </b>
                          </span>
                        ) : (
                          <SmallLoader />
                        )}
                      </b>
                    </td>
                  </tr>

                  <tr>
                    <td>Year's balance</td>
                    <td>
                      <b>{yearSum ? yearSum + " $" : <SmallLoader />}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Salary payed</td>
                    <td>
                      <b>
                        {yearSum ? (
                          <span style={{ color: "orange" }}>
                            {" "}
                            {Math.floor(yearSum * 0.45) + " $"}{" "}
                          </span>
                        ) : (
                          <SmallLoader />
                        )}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td>Payments to clients</td>
                    <td>
                      <b>
                        {yearSum ? (
                          <span style={{ color: "orange" }}>
                            {" "}
                            {Math.floor(yearSum * 0.1) + " $"}{" "}
                          </span>
                        ) : (
                          <SmallLoader />
                        )}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td>Total profit</td>
                    <td>
                      <b>
                        {yearSum ? (
                          <span className={"green-text"}>
                            {" "}
                            {yearSum -
                              Math.floor(yearSum * 0.4) -
                              Math.floor(yearSum * 0.1) +
                              " $"}{" "}
                          </span>
                        ) : (
                          <SmallLoader />
                        )}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
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
