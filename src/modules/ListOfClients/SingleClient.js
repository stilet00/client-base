import React, { useState, useMemo, useCallback } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Rating } from "@mui/material";
import Link from "@mui/material/Link";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import MenuSharpIcon from "@mui/icons-material/MenuSharp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowAltCircleUp,
	faArrowAltCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { getMomentUTC } from "sharedFunctions/sharedFunctions";

function SingleClient({ getUpdatingClient, switchToGraph, ...client }) {
	const {
		_id,
		name,
		surname,
		bankAccount,
		svadba,
		dating,
		instagramLink,
		image,
		suspended,
		allYearsProfit,
		previousMiddleMonthSum,
		totalPayments,
		currentMonthTotalAmount,
		previousMonthTotalAmount,
		twoMonthBeforeAmount,
		translators,
		rating,
		middleMonthSum,
		monthProgressPercent,
		handleUpdatingClientsId,
	} = client;
	const [expanded, setExpanded] = useState(false);
	const [displayMenu, setDisplayMenu] = useState(false);
	const [displayProfit, setDisplayProfit] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleChange = useCallback(() => {
		setExpanded((prev) => !prev);
	}, []);

	const currentMonth = useMemo(() => {
		return getMomentUTC().format("MMMM").length > 5
			? getMomentUTC().format("MMM")
			: getMomentUTC().format("MMMM");
	}, []);

	const previousMonth = useMemo(() => {
		return getMomentUTC().subtract(1, "month").format("MMMM").length > 5
			? getMomentUTC().subtract(1, "month").format("MMM")
			: getMomentUTC().subtract(1, "month").format("MMMM");
	}, []);

	const twoMonthBefore = useMemo(() => {
		return getMomentUTC().subtract(2, "month").format("MMMM").length > 5
			? getMomentUTC().subtract(2, "month").format("MMM")
			: getMomentUTC().subtract(2, "month").format("MMMM");
	}, []);

	const payedToTranslators = useMemo(
		() => Math.round(allYearsProfit * 0.45),
		[allYearsProfit],
	);
	const clientProfit = useMemo(
		() => Math.round(allYearsProfit - payedToTranslators - totalPayments),
		[allYearsProfit, payedToTranslators, totalPayments],
	);
	const handleCopy = useCallback(() => {
		const isMobileDevice = /Mobi/i.test(navigator.userAgent);
		if (!isMobileDevice) {
			setCopied(true);
			navigator.clipboard.writeText(bankAccount);
		}
	}, [bankAccount]);

	const avatarImage = image ? image : "/";

	if (suspended) {
		return (
			<Card
				className="translator-item gradient-box"
				style={{ position: "relative" }}
			>
				<div
					style={{
						position: "absolute",
						width: "96%",
						height: "40px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%) skew(1deg, -30deg)",
						background:
							"linear-gradient(to bottom, rgb(255, 216, 7) 50%, rgb(255, 193, 0) 60%)",
						borderRadius: "4px",
						padding: "10px",
						color: "black",
						fontSize: "24px",
						fontWeight: "bold",
					}}
				>
					<span
						style={{
							border: "3px solid black",
							transform: "skew(30deg, 0deg)",
							color: "transparent",
							background: "linear-gradient(to bottom, gray 50%, black 50%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							mask: "linear-gradient(to bottom, transparent 50%, black 50%)",
						}}
					>
						DISABLED
					</span>
				</div>
			</Card>
		);
	}

	return (
		<Card className="translator-item gradient-box">
			<CardHeader
				sx={{
					position: "relative",
					justifyContent: "space-between",
					height: "50px",
					"& .MuiCardHeader-avatar": { margin: 0 },
					"& .MuiCardHeader-content": {
						position: "absolute",
						left: "50%",
						transform: "translateX(-50%)",
					},
				}}
				title={<Rating name="read-only" value={rating} readOnly size="small" />}
				avatar={
					<Avatar
						sx={{
							width: 56,
							height: 56,
							transition: "all 0.2s ease-in-out",
							"&:hover": image && {
								position: "absolute",
								top: "0",
								left: "0",
								zIndex: "1",
								width: "100%",
								height: "300px",
								borderRadius: "4px 4px 0 0",
							},
						}}
						src={avatarImage}
						aria-label="photo"
					/>
				}
				action={
					<ClickAwayListener onClickAway={() => setDisplayMenu(false)}>
						<IconButton
							onClick={() => setDisplayMenu(!displayMenu)}
							className="list-item__menu-button"
						>
							<MenuSharpIcon />
							{displayMenu && (
								<div className="list-item__menu-button__content-holder">
									<Button
										variant="contained"
										aria-label="delete"
										size="small"
										startIcon={<EditIcon />}
										onClick={() => handleUpdatingClientsId(_id)}
									>
										Edit
									</Button>
								</div>
							)}
						</IconButton>
					</ClickAwayListener>
				}
			/>
			<CardContent>
				<Typography variant="h5">{`${name} ${surname}`}</Typography>
				<Typography
					variant="body2"
					align={"left"}
					className="grid-template-container"
				>
					<span className="grid-template-container__title">
						Total for {currentMonth}:
					</span>
					<b className="styled-text-numbers grid-template-container__info">{`${currentMonthTotalAmount} $`}</b>
				</Typography>
				<Typography
					variant="body2"
					align={"left"}
					className="grid-template-container"
				>
					<span className="grid-template-container__title">
						Total for {previousMonth}:
					</span>
					<b className="styled-text-numbers grid-template-container__info">{`${previousMonthTotalAmount} $`}</b>
				</Typography>
				<Typography
					variant="body2"
					align={"left"}
					className="grid-template-container"
				>
					<span className="grid-template-container__title">
						Total for {twoMonthBefore}:
					</span>
					<b className="styled-text-numbers grid-template-container__info">{`${twoMonthBeforeAmount} $`}</b>
				</Typography>
				<Typography
					variant="body2"
					align={"left"}
					className="grid-template-container"
				>
					<span className="grid-template-container__title">
						Middle for {currentMonth}:
					</span>
					<div className="grid-template-container__info">
						<span
							className="styled-text-numbers percents-margin"
							style={{
								color:
									middleMonthSum >= previousMiddleMonthSum ? "green" : "red",
							}}
						>
							{middleMonthSum >= previousMiddleMonthSum ? (
								<FontAwesomeIcon
									style={{ color: "green" }}
									icon={faArrowAltCircleUp}
								/>
							) : (
								<FontAwesomeIcon
									style={{ color: "red" }}
									icon={faArrowAltCircleDown}
								/>
							)}{" "}
							{`${monthProgressPercent}%`}
						</span>
						<b className="styled-text-numbers grid-template-container__info">
							{" "}
							{middleMonthSum} $
						</b>
					</div>
				</Typography>

				<Typography
					variant="body2"
					align={"left"}
					component="div"
					className="grid-template-container"
				>
					<span className="grid-template-container__title">
						Profile profit:
					</span>
					<ClickAwayListener onClickAway={() => setDisplayProfit(false)}>
						<Box
							className="grid-template-container__info"
							sx={{ position: "relative" }}
						>
							<Button
								variant="text"
								size="small"
								sx={{
									padding: 0,
									letterSpacing: 1,
									color: "black",
									textShadow: "1px 1px 1px rgb(0 0 0 / 20%)",
								}}
								startIcon={
									<AccountBalanceIcon
										sx={{ color: clientProfit < 0 ? "red" : "green" }}
									/>
								}
								onClick={() => setDisplayProfit(!displayProfit)}
							>
								<b className="styled-text-numbers">{clientProfit} $</b>
							</Button>
							{displayProfit && (
								<Box
									sx={{
										position: "absolute",
										minWidth: 200,
										display: "flex",
										flexDirection: "column",
										top: 28,
										right: "5px",
										zIndex: 1,
										borderRadius: "8px",
										p: 1,
										bgcolor: "background.paper",
									}}
								>
									{totalPayments > 0 && (
										<span className="balance-menu_item">
											Client's spends:
											<b>{`-${totalPayments} $`}</b>
										</span>
									)}
									<span className="balance-menu_item">
										Total profit:
										<b>{`${allYearsProfit} $`}</b>
									</span>
									<span className="balance-menu_item">
										Payed to translators:
										<b>{`${payedToTranslators} $`}</b>
									</span>
								</Box>
							)}
						</Box>
					</ClickAwayListener>
				</Typography>

				<Typography
					variant="body2"
					align={"left"}
					className="grid-template-container"
				>
					<span className="grid-template-container__title">Bank account:</span>
					<span className="grid-template-container__card">
						<IconButton
							sx={{ color: copied ? "green" : "gray" }}
							variant="contained"
							size="small"
							onClick={handleCopy}
						>
							<ContentCopyIcon fontSize="small" />
						</IconButton>
						{bankAccount}
					</span>
				</Typography>

				<Typography
					variant="body2"
					align={"left"}
					className="grid-template-container"
				>
					<span className="grid-template-container__title">
						Assigned translators:
					</span>
					<span
						className="grid-template-container__card"
						style={{ display: "grid" }}
					>
						{translators?.map((translator) => (
							<span
								key={`${translator._id}-${_id}`}
								style={{ textAlign: "end" }}
							>
								{`${translator.name} ${translator.surname}`}
							</span>
						))}
					</span>
				</Typography>
			</CardContent>

			<CardActions
				style={{ display: "grid", gridTemplateColumns: "40px auto" }}
			>
				<Typography align={"left"} style={{ alignSelf: "end" }}>
					<Link variant="button" href={instagramLink} underline="none">
						<InstagramIcon fontSize="large" sx={{ color: red[400] }} />
					</Link>
				</Typography>

				{!suspended && (
					<Accordion
						expanded={expanded}
						onChange={handleChange}
						className="grid-template-container__card"
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1bh-content"
							id="panel1bh-header"
						>
							<Typography sx={{ flexShrink: 0 }}>Sites Access</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography
								variant="body2"
								align={"left"}
								className="grid-template-container"
							>
								<span className="grid-template-container__title">Logins:</span>
								<span className="grid-template-container__card">
									Passwords:
								</span>
							</Typography>
							<Typography
								variant="body2"
								align={"left"}
								className="grid-template-container"
							>
								<span className="grid-template-container__title">
									{svadba.login}
								</span>
								<span className="grid-template-container__card">
									{svadba.password}
								</span>
							</Typography>
							<Typography
								variant="body2"
								align={"left"}
								className="grid-template-container"
							>
								<span className="grid-template-container__title">
									{dating.login}
								</span>
								<span className="grid-template-container__card">
									{dating.password}
								</span>
							</Typography>
						</AccordionDetails>
					</Accordion>
				)}
			</CardActions>
		</Card>
	);
}

export default SingleClient;
