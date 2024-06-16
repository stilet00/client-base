import { Bar, Line } from "react-chartjs-2";
import "../../../styles/modules/SingleChart.css";
import { Chart, registerables } from "chart.js";
import moment from "moment";

Chart.register(...registerables);

function SingleChart({ graph, index, previousMonth }) {
	let dataSets = [
		{
			label: "Current month",
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
	];
	if (previousMonth) {
		dataSets.push({
			label: "Previous month",
			fill: true,
			backgroundColor: ["rgba(25,118,210,0.5)"],
			borderColor: ["#1976d2"],
			borderWidth: 0.5,
			data: previousMonth.values,
			tension: 0.4,
			borderDash: [5, 1],
			cubicInterpolationMode: "monotone",
			borderRadius: 4,
		});
	}

	const data = {
		_id: graph._id,
		labels: graph.days || [],
		title: moment(`${graph.year}-${graph.month}`, "YYYY-MM")
			.hours(12)
			.utc()
			.format("MMMM, YYYY"),
		datasets: dataSets,
	};

	let delayed;

	const options = {
		animation: {
			onComplete: () => {
				delayed = true;
			},
			delay: (context) => {
				let delay = 0;
				if (context.type === "data" && context.mode === "default" && !delayed) {
					delay = context.dataIndex * 300 + context.datasetIndex * 100;
				}
				return delay;
			},
		},
		title: {
			color: "red",
		},
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
				display: Boolean(previousMonth),
				labels: {
					color: "white",
				},
			},
			title: {
				color: "white",
				display: true,
				text: moment(`${graph.year}-${graph.month}`, "YYYY-MM")
					.hours(12)
					.utc()
					.format("MMMM-YYYY"),
			},
			labels: {
				color: "red",
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
				<p className={"total-text"}>{`Total: ${graph.values
					.reduce((sum, current) => {
						return sum + Number(current);
					}, 0)
					.toFixed(2)} $`}</p>
				<span className={"green-line"} />
				<p className={"total-text"}>{`Middle: ${
					graph.values.length
						? Math.floor(
								graph.values.reduce((sum, current) => {
									return sum + Number(current);
								}, 0) / graph.values.length,
							)
						: "0"
				} $`}</p>
			</div>
		</div>
	);
}

export default SingleChart;
