import { Bar, Line } from "react-chartjs-2";
import "../../../styles/modules/SingleChart.css";
import DeleteIcon from "@material-ui/icons/Delete";
import ChartDateForm from "../ChartDateForm/ChartDateForm";
import ColoredButton from "../../../sharedComponents/ColoredButton/ColoredButton";
import { useSingleChart } from "../businessLogic";
import moment from "moment";

function SingleChart(props) {
  const { onChartChange, deleteGraph, graph, index } = useSingleChart(props);

  const data = {
    _id: graph._id,
    labels: graph.days || [],
    title: moment(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
    datasets: [
      {
        fill: true,
        backgroundColor: ["rgba(255,255,255,0.7)"],
        borderColor: ["#ffffff"],
        borderWidth: 0.5,
        data: graph.values,
        tension: 0.4,
        borderDash: [5, 2],
        cubicInterpolationMode: "monotone",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        suggestedMin: 0,
        ticks: {
          color: "white",
          beginAtZero: true,
          callback: function (value) {
            return value + " $.";
          },
        },
      },
      x: {
        ticks: {
          color: "white",
          callback: function (value) {
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
        color: "white",
        display: true,
        text: moment(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
      },
    },
  };

  const chartStyle =
    index % 2 ? (
      <Bar data={data} options={options} />
    ) : (
      <Line data={data} options={options} />
    );

  return (
    <div className={"single-chart"}>
      {chartStyle}
      <div className="total-sum">
        <p className={"total-text"}>{`Total: ${Math.round(
          graph.values.reduce((sum, current) => {
            return sum + Number(current);
          }, 0)
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

      {/*<div className="button-chart-edit">*/}
      {/*  <ColoredButton*/}
      {/*    onClick={() => deleteGraph(data._id)}*/}
      {/*    variant={"outlined"}*/}
      {/*  >*/}
      {/*    <DeleteIcon />*/}
      {/*  </ColoredButton>*/}
      {/*  <ChartDateForm monthData={data} onValueSubmit={onChartChange} />*/}
      {/*</div>*/}
    </div>
  );
}

export default SingleChart;
