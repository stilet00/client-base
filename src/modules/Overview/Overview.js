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

function Overview(props) {
  const [charts, setCharts] = useState([]);
  const [currentYear, setCurrentYear] = useState(moment().format("YYYY"));
  const [clients, setClients] = useState([]);
  const [translators, setTranslators] = useState([]);
  const [progressStatus, setProgressStatus] = useState(true);
  const [progressValue, setProgressValue] = useState(null);
  const [yearSum, setYearSum] = useState(null);
  useEffect(() => {
    getBalance().then((res) => {
      if (res.status === 200) {
        let byYearFiltredArray = res.data.filter(
            (item) => item.year === currentYear
        );
        console.log(byYearFiltredArray)
        setCharts(byYearFiltredArray);
        getMonthProgress(byYearFiltredArray);
        getYearSum(byYearFiltredArray);
      }
    });
  }, []);
  useEffect(() => {
    getClients().then((res) => {
      if (res.status === 200) {
        setClients(res.data);
      }
    });
  }, [])
  useEffect(() => {
    getTranslators().then((res) => {
      if (res.status === 200) {
        setTranslators(res.data);
      }
    });
  }, [])
  function reduceArray(array) {
      return array.reduce((sum , current) => {
        return Number(sum) + Number(current);
      });


  }
  function getSumTillNow(array, forFullMonth = false) {
    let sum = 0;
    if (forFullMonth) {
      array.values.forEach(item => {
        sum = item ? sum + Number(item) : sum
      })
    } else {
      if (array) {
        array.values.forEach((item, index) => {
          if ((index < Number(moment().format("DD"))) && (item)) {
            sum = sum + Number(item);
          }
        });
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

    let previousMonthNumber = "0" + (Number(moment().format("MM")) - 1);
    let previousMonth = yearArray.find(
      (item) => item.month === previousMonthNumber
    );
    if (!currentMonth) {
      currentMonth = yearArray[yearArray.length - 1]
      previousMonth = yearArray[yearArray.length - 2]
      let currentSum = getSumTillNow(currentMonth, true);
      let previousSum = getSumTillNow(previousMonth, true);
      if (currentSum > previousSum) {
        setProgressValue((currentSum / previousSum).toFixed(2).split(".")[1]);
      } else {
        setProgressStatus(false);
        setProgressValue((previousSum / currentSum).toFixed(2).split(".")[1]);
      }
    } else {
      let currentSum = getSumTillNow(currentMonth);
      let previousSum = getSumTillNow(previousMonth);
      if (currentSum > previousSum) {
        setProgressValue((currentSum / previousSum).toFixed(2).split(".")[1]);
      } else if (currentSum !== 0 && previousSum !== 0) {
        setProgressStatus(false);
        setProgressValue((previousSum / currentSum).toFixed(2).split(".")[1]);
      } else {
        console.log(currentSum)
        setProgressStatus(false)
        setProgressValue(0)
      }
    }

  }

  let monthProgressPage = progressValue || progressValue === 0 ? (
    progressStatus ? (
      <span style={{ color: "green" }}> + {progressValue} %</span>
    ) : (
      <span style={{ color: "red" }}> - {progressValue} %</span>
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
    <span style={{ color: "green" }}>
      {" "}
      {yearSum -
        Math.floor(yearSum * 0.4) -
        Math.floor(yearSum * 0.1) +
        " $"}{" "}
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
            <div className={"taskList-container chart-container table-container"}>
              <h1>Agency statistics</h1>
              <table>
                <thead>
                  <tr>
                    <th>Statistic's type</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
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
                      <b>{clients.length ? clients.length : <SmallLoader />}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Total translators</td>
                    <td>
                      <b>
                        {translators.length ? translators.length : <SmallLoader />}
                      </b>
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
