import React from "react";
import { Line } from "react-chartjs-2";
import "../../../styles/modules/SingleChart.css";
import { getSumFromArray, getMomentUTC } from "sharedFunctions/sharedFunctions";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function SingleChart({ graph, previousMonth, values }) {
	let dataSets = [
		{
			label: "Current month",
			fill: true,
			backgroundColor: ["rgba(255,255,255,0.7)"],
			borderColor: ["#ffffff"],
			borderWidth: 0.5,
			data: values.currentMonth,
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
			data: values.previousMonth,
			tension: 0.4,
			borderDash: [5, 1],
			cubicInterpolationMode: "monotone",
			borderRadius: 4,
		});
	}

	const data = {
		_id: graph._id,
		labels: graph.days || [],
		title: getMomentUTC(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
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
				text: getMomentUTC(`${graph.year}-${graph.month}`).format("MMMM-YYYY"),
			},
			labels: {
				color: "red",
			},
		},
	};

	return (
		<div className={"single-chart hide-on-mobile-portrait"}>
			<Line data={data} options={options} />
			<div className="total-sum">
				<p className={"total-text"}>{`Total: ${getSumFromArray(
					values.currentMonth,
				).toFixed(2)} $`}</p>
				<span className={"green-line"} />
				<p className={"total-text"}>{`Middle: ${
					values.currentMonth.length
						? Math.floor(
								getSumFromArray(values.currentMonth) /
									values.currentMonth.length,
							)
						: "0"
				} $`}</p>
			</div>
		</div>
	);
}
