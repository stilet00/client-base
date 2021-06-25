import React, { useEffect, useState } from "react";
import "./Chart.css";
import Header from "../Header/Header";
import SmallChart from "./SmallChart/SmallChart";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import {
  addMonth,
  addYear,
  getBalance,
  removeYear,
} from "../../services/balanceServices/services";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ChartForm from "./ChartForm/ChartForm";
function Chart(props) {
  const [months, setMonths] = useState([]);
  useEffect(() => {
    getBalance().then((res) => {
      if (res.status === 200) {
        setMonths(res.data);
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

      }
    })
  }
  return (
    <>
      <Header />
      <div className={"inner-gallery-container chart-container"}>
        <ul>
        {/*<TransitionGroup className="todo-list" component={"ul"}>*/}
          {months.map((month, index) => (
            // <CSSTransition key={year._id} timeout={500} classNames="item">
              <SmallChart
                graph={month}
                index={index}
                key={month._id}
                deleteGraph={deleteGraph}
              />
            // </CSSTransition>
          ))}
        {/*</TransitionGroup>*/}
        </ul>
      </div>
      <div className={"socials button-add-container"}>
        <ChartForm onMonthSubmit={onMonthSubmit}/>
        {/*<Button fullWidth onClick={addData}>*/}
        {/*  <AddIcon />*/}
        {/*</Button>*/}
      </div>
    </>
  );
}

export default Chart;
