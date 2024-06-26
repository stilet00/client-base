import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import "../../styles/sharedComponents/SumArray.css";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import InputAdornment from "@mui/material/InputAdornment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { getMomentUTC } from "sharedFunctions/sharedFunctions";
import { StyledTextField } from "../../../sharedComponents/StyledMaterial/styledMaterialComponents";

function SumArray({
	getTotalDays,
	selectedMonth,
	currentYear,
	valuesStatus,
	onSubmit,
}) {
	const [isMultipleChecked, setIsMultipleChecked] = useState(false);
	const [valuesArray, setValuesArray] = useState([]);
	function onInputChange(e) {
		let editedArray = valuesArray;
		editedArray[Number(e.target.id) - 1] = e.target.value;
		setValuesArray(editedArray);
	}
	function onCheckboxChange() {
		setIsMultipleChecked(!isMultipleChecked);
	}
	return (
		<div className={"checkbox-container"}>
			<FormControlLabel
				control={
					<Checkbox onChange={onCheckboxChange} checked={isMultipleChecked} />
				}
				label="Enter multiple data"
			/>
			{valuesStatus ? (
				<span className={"mass-data-flag green-text"}>
					<b>Values added</b>
				</span>
			) : null}
			<div
				className={
					isMultipleChecked ? "data-input-table" : "data-input-table invisible"
				}
			>
				<table>
					<thead>
						<tr>
							<td colSpan={"2"} style={{ textAlign: "center" }}>
								Enter $ for dates
							</td>
						</tr>
						<tr>
							<td>Date</td>
							<td>Sum</td>
						</tr>
					</thead>
					<tbody>
						{getTotalDays().map((singleDay) => {
							return (
								<>
									<tr>
										<td>
											{getMomentUTC(
												`${currentYear}/${selectedMonth}/${singleDay}`,
											).format("MMMM-DD")}
										</td>
										<td>
											<StyledTextField
												variant="outlined"
												type={"number"}
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<AttachMoneyIcon />
														</InputAdornment>
													),
												}}
												id={singleDay}
												onChange={onInputChange}
											/>
										</td>
									</tr>
								</>
							);
						})}
						<tr>
							<td colSpan={"2"}>
								<Button
									fullWidth
									onClick={() => {
										onCheckboxChange();
										onSubmit(valuesArray);
									}}
								>
									<SaveIcon />
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default SumArray;
