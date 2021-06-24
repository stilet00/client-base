import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "./SmallChart.css";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";

function SmallChart({ graph, index, deleteGraph }) {
  const [data, setData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
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
      },
    ],
  });
  useEffect(() => {
    setData({
      ...data,
      datasets: [{ ...data.datasets[0], label: graph.label, data: graph.data }],
    });
  }, []);

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
  };
  const paint =
    index % 2 ? (
      <Line data={data} options={options} />
    ) : (
      <Bar data={data} options={options} />
    );

  return (
    <div className={"single-chart"}>
      {paint}
      <Button onClick={() => deleteGraph(graph._id)}>
        <DeleteIcon />
      </Button>
    </div>
  );
}

export default SmallChart;
