import React, { useState, useEffect } from "react";
import "../../../styles/modules/LoggedOut.css";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { fadeOut } from "react-animations";
import styled, { keyframes } from "styled-components";
import HomeIcon from "@mui/icons-material/Home";

const Animate = styled.div`
    animation: 6s ${keyframes`${fadeOut}`};
    width: 100%;
    height: 100%;
    z-index: 3;
`;

function LoggedOutPage() {
	const [time, setTime] = useState(3);
	const navigate = useNavigate();

	function reduceTime() {
		if (time > 1) {
			setTime(time - 1);
		} else {
			navigate("/");
		}
	}
	useEffect(() => {
		const timeCount = setTimeout(reduceTime, 1000);
		return () => {
			clearTimeout(timeCount);
		};
	});

	return (
		<Animate>
			<div className={"logged-out"}>
				<h1>You have been logged out...</h1>
				<p>You will be redirected in ...{time}</p>
				<Button
					onClick={() => navigate("/")}
					variant={"outlined"}
					startIcon={<HomeIcon />}
				>
					Back
				</Button>
			</div>
		</Animate>
	);
}

export default LoggedOutPage;
