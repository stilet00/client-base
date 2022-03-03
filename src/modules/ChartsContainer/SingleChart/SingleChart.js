import { Bar, Line } from "react-chartjs-2";
import "../../../styles/modules/SingleChart.css";
import DeleteIcon from "@material-ui/icons/Delete";
import ChartDateForm from "../ChartDateForm/ChartDateForm";
import ColoredButton from "../../../sharedComponents/ColoredButton/ColoredButton";
import {useSingleChart} from "../businessLogic";

function SingleChart(props) {
  const { onChartChange,
          deleteGraph,
          data,
          graph,
          index,
          options } = useSingleChart(props);

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

export default SingleChart;
