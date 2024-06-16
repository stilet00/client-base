import React from "react";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import TranslatorsForm from "./TranslatorsForm/TranslatorsForm";
import SingleTranslator from "./SingleTranslator/SingleTranslator";
import "../../styles/modules/Translators.css";
import Loader from "../../sharedComponents/Loader/Loader";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { useTranslators } from "./businessLogic";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClientsList from "../Clients/ClientsList/ClientsList";
import { Checkbox } from "@mui/material";
import useWindowDimensions from "../../sharedHooks/useWindowDimensions";
import { useAdminStatus } from "../../sharedHooks/useAdminStatus";
import TotalButtonWithDialog from "./ShowTotal/index";
import SendEmails from "./SendEmails";

function Translators() {
	const user = useSelector((state) => state.auth.user);
	const { screenIsSmall } = useWindowDimensions();
	const {
		translators,
		dragLeaveHandler,
		dragOverHandler,
		loading,
		onBoardDrop,
		state,
		toggleDrawer,
		openAlert,
		closeAlert,
		alertOpen,
		dragDropHandler,
		dragEndHandler,
		dragStartHandler,
		message,
		translatorsFormSubmit,
		alertStatusConfirmation,
		openAlertConfirmation,
		closeAlertConfirmationNoReload,
		suspendTranslator,
		toggleClientSuspended,
		changeFilter,
		memoizedFilteredTranslators,
		translatorFilter,
		updateTranslatorEmail,
		mailoutInProgress,
		dollarToUahRate,
		updateBalanceDayIsLoading,
	} = useTranslators(user);
	const { isAdmin } = useAdminStatus(user);

	return (
		<div className={"gallery-container"}>
			{screenIsSmall ? (
				<div className="gallery-menu gallery-menu_no-border">
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>Menu</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<ClientsList
								toggleDrawer={toggleDrawer}
								state={state}
								dragStartHandler={dragStartHandler}
								dragOverHandler={dragOverHandler}
								dragLeaveHandler={dragLeaveHandler}
								dragEndHandler={dragEndHandler}
								dragDropHandler={dragDropHandler}
							/>
							{isAdmin && (
								<>
									<TranslatorsForm onFormSubmit={translatorsFormSubmit} />
									<SendEmails />
								</>
							)}
							<TotalButtonWithDialog
								screenIsSmall={screenIsSmall}
								selectedDate={translatorFilter?.date}
							/>
							<div className="gallery-menu__filters">
								<div className={"gallery-menu__checkbox-container"}>
									<Checkbox
										defaultChecked
										name={"suspended"}
										onChange={changeFilter}
										disabled={!isAdmin}
									/>
									Hide suspended
								</div>
							</div>
						</AccordionDetails>
					</Accordion>
				</div>
			) : (
				<div className="bigScreen-translator-menu">
					<ClientsList
						toggleDrawer={toggleDrawer}
						state={state}
						dragStartHandler={dragStartHandler}
						dragOverHandler={dragOverHandler}
						dragLeaveHandler={dragLeaveHandler}
						dragEndHandler={dragEndHandler}
						dragDropHandler={dragDropHandler}
					/>
					{isAdmin && (
						<>
							<TranslatorsForm onFormSubmit={translatorsFormSubmit} />
							<SendEmails />
						</>
					)}
					<TotalButtonWithDialog
						screenIsSmall={screenIsSmall}
						selectedDate={translatorFilter?.date}
					/>
					<div className="gallery-menu__inline-filters">
						<div className="gallery-menu__filters-label">Menu</div>
						<div className={"gallery-menu__checkbox-container"}>
							<Checkbox
								defaultChecked
								name={"suspended"}
								disabled={!isAdmin}
								onChange={changeFilter}
							/>
							Hide suspended
						</div>
					</div>
				</div>
			)}
			<div
				id="on-scroll__rotate-animation-list"
				className={
					"inner-gallery-container translators-container scrolled-container"
				}
			>
				{translators.length && !loading ? (
					memoizedFilteredTranslators.map((item) => (
						<SingleTranslator
							{...item}
							key={item._id}
							dollarToUahRate={dollarToUahRate}
							dragOverHandler={dragOverHandler}
							onBoardDrop={onBoardDrop}
							dragLeaveHandler={dragLeaveHandler}
							updateBalanceDayIsLoading={updateBalanceDayIsLoading}
							openAlertConfirmation={openAlertConfirmation}
							closeAlertConfirmationNoReload={closeAlertConfirmationNoReload}
							suspendTranslator={suspendTranslator}
							toggleClientSuspended={toggleClientSuspended}
							updateTranslatorEmail={updateTranslatorEmail}
							admin={isAdmin}
						/>
					))
				) : loading ? (
					<div className="empty">
						{" "}
						<Loader />{" "}
					</div>
				) : (
					<div className="empty">
						<h1>No translators yet.</h1>
					</div>
				)}
			</div>
			<AlertMessage
				mainText={message.text}
				open={alertOpen}
				handleOpen={openAlert}
				handleClose={closeAlert}
				status={message.status}
			/>
		</div>
	);
}

export default Translators;
