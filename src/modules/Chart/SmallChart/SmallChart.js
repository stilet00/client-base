import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "./SmallChart.css";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import ChartDateForm from "../ChartDateForm/ChartDateForm";

function SmallChart({ graph, index, deleteGraph }) {
  const [data, setData] = useState({
    labels: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31"
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
  function numberToMonths(number) {
    switch (number) {
      case "0" :
        return "January";
        break;
      case "1" :
        return "February";
        break;
      case "2" :
        return "Match";
        break;
      case "3" :
        return "April";
        break;
      case "4" :
        return "May";
        break;
      case "5" :
        return "June";
        break;
      case "6" :
        return "July";
        break;
      case "7" :
        return "August";
        break;
      case "8" :
        return "September";
        break;
      case "9" :
        return "October";
        break;
      case "10" :
        return "November";
        break;
      case "11" :
        return "December";
        break;
      default:
        console.log('no months')
    }
  }
  useEffect(() => {
    setData({
      ...data,
      datasets: [{ ...data.datasets[0], label: numberToMonths(graph.label.split(" ")[0]) + " " + graph.label.split(" ")[1], data: graph.data }],
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
      <div className="button-chart-edit">
        <Button onClick={() => deleteGraph(graph._id)} variant={"outlined"}>
          <DeleteIcon />
        </Button>
        <ChartDateForm monthData={data}/>
      </div>

    </div>
  );
}

export default SmallChart;
