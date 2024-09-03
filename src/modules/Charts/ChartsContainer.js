import React from "react";
import { useSelector } from "react-redux";
import SingleChart from "./SingleChart/SingleChart";
import Loader from "../../sharedComponents/Loader/Loader";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import AlertMessageConfirmation from "../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation";
import { useChartsContainer } from "./businessLogic";
import "../../styles/modules/Chart.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { arrayOfYearsForSelectFilter } from "constants/constants";
import { CHARTS_CATEGORIES } from "constants/renderConstants";
import { getMomentUTC } from "sharedFunctions/sharedFunctions";

function ChartsContainer() {
	const user = useSelector((state) => state.auth.user);
	const { selectedYear, handleChange, chartsData, isLoading } =
		useChartsContainer(user);

	return (
		<>
			<div
				style={{
					width: "60%",
					margin: "0 auto",
					dislpay: "flex",
					flexDirection: "row",
					zIndex: 3,
				}}
			>
				<FormControl
					sx={{
						minWidth: "30%",
						maxWidth: "50%",
						"& .MuiInputLabel-root": {
							color: "white",
						},
						"& .MuiOutlinedInput-notchedOutline": {
							border: "2px solid",
							borderColor: "white",
							borderBottom: "none",
						},
					}}
				>
					<Select
						value={selectedYear}
						sx={{
							borderRadius: "0 4px 0 0",
							color: "white",
							"& .MuiSvgIcon-root": {
								color: "white",
							},
						}}
						onChange={handleChange}
					>
						{arrayOfYearsForSelectFilter.map((year) => (
							<MenuItem value={year}>{year}</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<div className={"main-container  scrolled-container"}>
				{isLoading && <Loader />}
				{!isLoading && (
					<>
						{chartsData?.length > 0 && (
							<ul className={"chart-list"}>
								{chartsData.map((month, index) => (
									<SingleChart
										previousMonth={
											month.month === getMomentUTC().format("MM")
												? chartsData[index + 1]
												: null
										}
										graph={month}
										index={index}
										key={index}
									/>
								))}
							</ul>
						)}
						{chartsData?.length === 0 && <h1> No data available. </h1>}
					</>
				)}
			</div>
		</>
	);
}

export default ChartsContainer;
