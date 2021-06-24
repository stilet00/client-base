import React, { useEffect, useState } from "react";
import "./Chart.css";
import Header from "../Header/Header";
import SmallChart from "./SmallChart/SmallChart";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import {
  addYear,
  getBalance,
  removeYear,
} from "../../services/balanceServices/services";
import { CSSTransition, TransitionGroup } from "react-transition-group";
function Chart(props) {
  const [years, setYears] = useState([]);
  useEffect(() => {
    getBalance().then((res) => {
      if (res.status === 200) {
        setYears(res.data);
      }
    });
  }, []);
  function addData() {
    addYear().then((res) =>
      getBalance().then((res) => {
        if (res.status === 200) {
          setYears(res.data);
        }
      })
    );
  }
  function deleteGraph(id) {
    removeYear(id).then((res) =>
      setYears(years.filter((item) => item._id !== id))
    );
  }
  return (
    <>
      <Header />
      <div className={"inner-gallery-container chart-container"}>
        <TransitionGroup className="todo-list" component={"ul"}>
          {years.map((year, index) => (
            <CSSTransition key={year._id} timeout={500} classNames="item">
              <SmallChart
                graph={year}
                index={index}
                key={year._id}
                deleteGraph={deleteGraph}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <div className={"socials button-add-container"}>
        <Button fullWidth onClick={addData}>
          <AddIcon />
        </Button>
      </div>
    </>
  );
}

export default Chart;
