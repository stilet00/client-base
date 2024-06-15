import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { lightBlue } from "@mui/material/colors";

const ColorButton = styled(Button)(({ theme }) => ({
	color: theme.palette.getContrastText(lightBlue[500]),
	backgroundColor: lightBlue[500],
	"&:hover": {
		backgroundColor: lightBlue[700],
	},
}));
export default function ColoredButton({
	innerContent,
	children,
	disabled,
	onClick,
	type,
	style,
}) {
	return (
		<div className={"green-button-container"}>
			<ColorButton
				variant="contained"
				disabled={disabled}
				onClick={onClick}
				type={type}
				fullWidth
				style={style}
			>
				{innerContent || children}
			</ColorButton>
		</div>
	);
}
