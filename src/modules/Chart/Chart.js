import React, { useEffect, useState } from "react";
import "./Chart.css";
import Header from "../Header/Header";
import SmallChart from "./SmallChart/SmallChart";
import {
  addMonth,
  getBalance,
  removeYear,
} from "../../services/balanceServices/services";
import ChartForm from "./ChartForm/ChartForm";
function Chart(props) {
  const [months, setMonths] = useState([]);
  function compareNumeric(a, b) {
    if (a.label.split()[0] > b.label.split()[0]) return 1;
    if (a.label.split()[0] == b.label.split()[0]) return 0;
    if (a.label.split()[0] < b.label.split()[0]) return -1;
  }

  useEffect(() => {
    getBalance().then((res) => {
      if (res.status === 200) {
        setMonths(res.data.sort(compareNumeric));
      }
    });
  }, []);
  function deleteGraph(id) {
    removeYear(id).then((res) =>
      setMonths(months.filter((item) => item._id !== id))
    );
  }
  function onMonthSubmit(date) {
    addMonth(date).then(res => {
      if (res.status === 200) {
        getBalance().then((res) => {
          if (res.status === 200) {
            setMonths(res.data.sort(compareNumeric));
          }
        });
      }
    })
  }
  return (
    <>
      <Header />
      <div className={"inner-gallery-container chart-container"}>
        <ul>
          {months.map((month, index) => (
              <SmallChart
                graph={month}
                index={index}
                key={month._id}
                deleteGraph={deleteGraph}
              />
          ))}
        </ul>
      </div>
      <div className={"socials button-add-container"}>
        <ChartForm onMonthSubmit={onMonthSubmit}/>
      </div>
    </>
  );
}

export default Chart;
