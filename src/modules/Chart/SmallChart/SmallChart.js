import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "./SmallChart.css";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import ChartDateForm from "../ChartDateForm/ChartDateForm";
import moment from "moment";

function SmallChart({ graph, index, deleteGraph, onValueSubmit }) {
  const [data, setData] = useState({
    _id: graph._id,
    labels: graph.days || [],
    title: moment(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
    datasets: [
      {
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        data: graph.values,
        label: "Balance flow by days",
        tension: 0.2,
        cubicInterpolationMode: "monotone",
        borderRadius: 5,
      },
    ],
  });
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      title: {
        display: true,
        text: moment(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
      },
    },
  };
  const paint =
    index % 2 ? (
      <Line data={data} options={options} />
    ) : (
      <Bar data={data} options={options} />
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
      <p className={"total-sum"}>{`Total: ${graph.values.reduce((sum, current) => { return sum+Number(current)}, 0)} $`}</p>
      <div className="button-chart-edit">
        <Button onClick={() => deleteGraph(data._id)} variant={"outlined"}>
          <DeleteIcon />
        </Button>
        <ChartDateForm monthData={data} onValueSubmit={onChartChange} />
      </div>
    </div>
  );
}

export default SmallChart;
