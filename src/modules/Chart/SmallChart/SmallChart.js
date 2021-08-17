import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "./SmallChart.css";
import DeleteIcon from "@material-ui/icons/Delete";
import ChartDateForm from "../ChartDateForm/ChartDateForm";
import moment from "moment";
import ColoredButton from "../../../shared/ColoredButton/ColoredButton";

function SmallChart({ graph, index, deleteGraph, onValueSubmit }) {
  const [data, setData] = useState({
    _id: graph._id,
    labels: graph.days || [],
    title: moment(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
    datasets: [
      {
        fill: true,
        backgroundColor: ["rgba(78, 205, 196, 0.7)"],
        borderColor: ["#000000"],
        borderWidth: 1.5,
        data: graph.values,
        tension: 0.4,
        borderDash: [5, 2],
        cubicInterpolationMode: "monotone",
        borderRadius: 4,
      },
    ],
  });
  const options = {
    scales: {
      y: {
        suggestedMin: 0,
        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            return value + " $.";
          },
        },
      },
      x: {
        ticks: {
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
        display: true,
        text: moment(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
      },
    },
  };
  const paint =
    index % 2 ? (
      <Bar data={data} options={options} />
    ) : (
      <Line data={data} options={options} />
    );
  function onChartChange(data) {
    let newArray = graph.values;
    newArray[data.selectedDate - 1] = data.value;
    let newGraph = { ...graph, values: newArray };
    onValueSubmit(newGraph);
  }
  return (
    <div className={"single-chart"}>
      {paint}
      <div className="total-sum">
        <p className={"total-text"}>{`Total: ${graph.values.reduce(
          (sum, current) => {
            return sum + Number(current);
          },
          0
        )} $`}</p>
        <span className={"green-line"} />
        <p className={"total-text"}>{`Middle: ${
          graph.values.length
            ? Math.floor(
                graph.values.reduce((sum, current) => {
                  return sum + Number(current);
                }, 0) / graph.values.length
              )
            : "0"
        } $`}</p>
      </div>

      <div className="button-chart-edit">
        <ColoredButton
          onClick={() => deleteGraph(data._id)}
          variant={"outlined"}
        >
          <DeleteIcon />
        </ColoredButton>
        <ChartDateForm monthData={data} onValueSubmit={onChartChange} />
      </div>
    </div>
  );
}

export default SmallChart;
