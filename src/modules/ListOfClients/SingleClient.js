import React, { useState } from "react";
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
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import { TRANSLATORS_SALARY_PERCENT } from "../../constants/constants";
import { CHARTS_CATEGORIES } from "constants/renderConstants";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAdminStatus } from "sharedHooks/useAdminStatus";
import {
	faArrowAltCircleUp,
	faArrowAltCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { getMomentUTC } from "sharedFunctions/sharedFunctions";

function SingleClient({
	_id,
	name,
	surname,
	currentMonthTotalAmount,
	previousMonthTotalAmount,
	middleMonthSum,
	prevousMiddleMonthSum,
	monthProgressPercent,
	translators,
	bankAccount,
	instagramLink,
	handleUpdatingClientsId,
	twoMonthBeforeAmount,
	svadba,
	dating,
	handleSwitchToGraph,
	loss,
	currentYearProfit,
	image,
	rating,
	suspended,
}) {
	const admin = useAdminStatus();
	const [expanded, setExpanded] = useState(false);
	const [displayMenu, setDisplayMenu] = useState(false);
	const [displayProfit, setDisplayProfit] = useState(false);
	const [copied, setCopied] = useState(false);
	const [openCategorySelect, setOpenCategorySelect] = useState(false);
	const handleChange = (e) => {
		setExpanded(!expanded);
	};

	const catergoriesWithIcons = CHARTS_CATEGORIES.filter(
		(category) => category.icon,
	);

	const payedToTranslators = Math.round(
		currentYearProfit * TRANSLATORS_SALARY_PERCENT,
	);
	const clientProfit = Math.round(
		currentYearProfit - payedToTranslators - loss,
	);
	const currentMonth =
		getMomentUTC().format("MMMM").length > "5"
			? getMomentUTC().format("MMM")
			: getMomentUTC().format("MMMM");
	const previousMonth =
		getMomentUTC().subtract(1, "month").format("MMMM").length > "5"
			? getMomentUTC().subtract(1, "month").format("MMM")
			: getMomentUTC().subtract(1, "month").format("MMMM");
	const twoMonthBefore =
		getMomentUTC().subtract(1, "month").format("MMMM").length > "5"
			? getMomentUTC().subtract(2, "month").format("MMM")
			: getMomentUTC().subtract(2, "month").format("MMMM");
	const progressPage = (
		<div className="grid-template-container__info">
			{!suspended && (
				<>
					{/* <IconButton
                        color="primary"
                        variant="contained"
                        size="small"
                        sx={{
                            padding: 0,
                        }}
                        onClick={() =>
                            setOpenCategorySelect(!openCategorySelect)
                        }
                    >
                        {openCategorySelect ? (
                            <ClickAwayListener
                                onClickAway={() => setOpenCategorySelect(false)}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    {catergoriesWithIcons.map(
                                        (category, index) => (
                                            <React.Fragment
                                                key={category + index}
                                            >
                                                <label
                                                    htmlFor={category.name}
                                                    className={
                                                        category.value === null
                                                            ? 'category-all'
                                                            : `category-${category.value}`
                                                    }
                                                >
                                                    {category.icon}
                                                </label>
                                                <input
                                                    type="radio"
                                                    id={category.name}
                                                    className={
                                                        category.value === null
                                                            ? 'category-all category-select'
                                                            : `category-${category.value} category-select`
                                                    }
                                                    value={category.value}
                                                    onChange={e => {
                                                        const argsForHandleSwitchToGraph =
                                                            {
                                                                id: _id,
                                                                category:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        handleSwitchToGraph(
                                                            argsForHandleSwitchToGraph
                                                        )
                                                    }}
                                                ></input>
                                            </React.Fragment>
                                        )
                                    )}
                                </Box>
                            </ClickAwayListener>
                        ) : (
                            <QueryStatsIcon fontSize="small" />
                        )}
                    </IconButton> */}
					<span
						className={
							middleMonthSum >= prevousMiddleMonthSum
								? " green-text styled-text-numbers percents-margin"
								: " red-text styled-text-numbers percents-margin"
						}
					>
						{middleMonthSum >= prevousMiddleMonthSum ? (
							<FontAwesomeIcon icon={faArrowAltCircleUp} />
						) : (
							<FontAwesomeIcon icon={faArrowAltCircleDown} />
						)}
						{` ${monthProgressPercent}%`}
					</span>
				</>
			)}
			<b className="styled-text-numbers grid-template-container__info">
				{middleMonthSum} $
			</b>
		</div>
	);

	const avatarImage = image ? image : "/";

	return (
		<Card
			className="translator-item gradient-box"
			style={{
				position: "relative",
				minHeight: admin ? 350 : "auto",
				...(suspended && {
					backgroundImage:
						"linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2))",
					overflow: "visible",
				}),
			}}
		>
			{suspended && (
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
						background: `linear-gradient(to bottom, rgb(255, 216, 7) 50%, rgb(255, 193, 0) 60%)`,
						borderRadius: "4px",
						padding: "10px",
						color: "black",
						fontSize: "24px",
						fontWeight: "bold",
						overflow: "hidden",
					}}
				>
					<span
						style={{
							border: "3px solid black",
							display: "inline-block",
							transform: "skew(30deg, 0deg)",
							fontFamily: "inherit",
							borderImage: `linear-gradient(to bottom, gray 50%, black 50%)`,
							borderImageSlice: "1",
							padding: "5px",
							color: "transparent",
							background: "linear-gradient(to bottom, gray 50%, black 50%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent", // For Safari compatibility
							mask: "linear-gradient(to bottom, transparent 50%, black 50%)",
						}}
					>
						DISABLED
					</span>
				</div>
			)}
			<CardHeader
				sx={{
					position: "relative",
					justifyContent: "space-between",
					height: "50px",
					"& .MuiCardHeader-avatar": {
						margin: 0,
					},
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
							"& .MuiAvatar-img": {
								objectPosition: "top",
							},
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
					{progressPage}
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
										sx={{
											color: clientProfit < 0 ? "red" : "green",
										}}
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
									{loss > 0 && (
										<span className="balance-menu_item">
											Client's spends:
											<b>{`-${loss} $`}</b>
										</span>
									)}
									<span className="balance-menu_item">
										Total profit:
										<b>{`${currentYearProfit} $`}</b>
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
							sx={{
								color: copied ? "green" : "gray",
							}}
							variant="contained"
							size="small"
							onClick={(e) => {
								const isMobileDevice = /Mobi/i.test(navigator.userAgent);
								if (!isMobileDevice) {
									setCopied(true);
									navigator.clipboard.writeText(bankAccount);
								}
							}}
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
				style={{
					display: "grid",
					gridTemplateColumns: "40px auto",
				}}
			>
				<Typography
					align={"left"}
					style={{
						alignSelf: "end",
					}}
				>
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
