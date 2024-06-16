import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getMomentUTC } from "sharedFunctions/sharedFunctions";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
	getBalanceTotalForCurrentMonthRequest,
	getBalanceDayForSelectedDate,
} from "services/balanceDayServices/index";
import Loader from "sharedComponents/Loader/Loader";
import { useAdminStatus } from "sharedHooks/useAdminStatus";

const StyledButton = styled(Button)`
    && {
        color: black;
    }
`;

const TotalButtonWithDialog = ({ screenIsSmall }) => {
	const user = useSelector((state) => state.auth.user);
	const { isAdmin } = useAdminStatus(user);
	const [anchorEl, setAnchorEl] = useState(null);
	const [sumForDay, setSumForDay] = useState(0);
	const [selectedDate, setSelectedDate] = useState(
		getMomentUTC().subtract(1, "day"),
	);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const open = Boolean(anchorEl);
	const popoverId = open ? "simple-popover" : undefined;
	const handleClose = () => {
		setAnchorEl(null);
	};
	const { data, isLoading } = useQuery(
		"balanceDays",
		getBalanceTotalForCurrentMonthRequest,
		{
			enabled: !!anchorEl,
		},
	);

	const { data: balanceDayData } = useQuery(
		["balanceDay", selectedDate],
		() => getBalanceDayForSelectedDate(selectedDate.format("YYYY-MM-DD")),
		{
			enabled: !!selectedDate,
			onSuccess: (res) => {
				setSumForDay(calculateStatisticsForDay(res.data));
			},
		},
	);

	const calculateStatisticsForDay = (data) => {
		const totalSum = data.reduce((total, item) => {
			const sum = Object.values(item.statistics).reduce(
				(acc, value) => acc + (typeof value === "number" ? value : 0),
				0,
			);
			return total + sum;
		}, 0);
		return totalSum.toFixed(2);
	};

	return (
		<>
			<StyledButton
				aria-describedby={popoverId}
				onClick={handleClick}
				fullWidth={screenIsSmall}
				startIcon={<FontAwesomeIcon icon={faPiggyBank} />}
			>
				Show total
			</StyledButton>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					{isLoading && <Loader />}
					{!isLoading && (
						<>
							<div className="date-container">
								<MobileDatePicker
									closeOnSelect
									label="Balance date"
									value={selectedDate}
									name={"date"}
									onChange={(date) => setSelectedDate(date)}
									disabled={!isAdmin}
									renderInput={(params) => <TextField {...params} />}
								/>
							</div>
							<Typography align={"left"}>
								{`Total by ${selectedDate.format("D MMMM")}: `}{" "}
								<b>{sumForDay}</b>
							</Typography>
							<Typography align={"left"}>
								{`Total by ${getMomentUTC().format("D MMMM")}: `}{" "}
								<b>
									<b>{`${data?.data} $`}</b>
								</b>
							</Typography>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default TotalButtonWithDialog;
