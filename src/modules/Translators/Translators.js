import Unauthorized from "../AuthorizationPage/Unauthorized/Unauthorized";
import Button from "@material-ui/core/Button";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TranslatorsForm from "./TranslatorsForm/TranslatorsForm";
import SingleTranslator from "./SingleTranslator/SingleTranslator";
import "../../styles/modules/Translators.css";
import ClientsForm from "../Clients/ClientsForm/ClientsForm";
import Loader from "../../sharedComponents/Loader/Loader";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { useTranslators } from "./businessLogic";
import React, { useState } from "react";
import AlertMessageConfirmation from "../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Popover,
  Typography,
} from "@material-ui/core";
import moment from "moment/moment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClientsList from "../Clients/ClientsList/ClientsList";
import { AnimatedList } from "react-animated-list";

function Translators({ user }) {
  const {
    translators,
    clients,
    dragLeaveHandler,
    dragOverHandler,
    loading,
    onBoardDrop,
    startTranslatorDelete,
    state,
    toggleDrawer,
    openAlert,
    closeAlert,
    alertOpen,
    clientsFormSubmit,
    deleteClient,
    dragDropHandler,
    dragEndHandler,
    dragStartHandler,
    message,
    translatorsFormSubmit,
    balanceDaySubmit,
    alertStatusConfirmation,
    openAlertConfirmation,
    closeAlertConfirmationNoReload,
    finishTranslatorDelete,
    calculateTranslatorMonthTotal,
    calculateTranslatorYesterdayTotal,
    calculateMonthTotal,
    suspendTranslator,
    suspendClient,
  } = useTranslators(user);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return user ? (
    <div className={"gallery-container"}>
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
            <div className={"socials button-add-container middle-button"}>
              <ClientsList
                clients={clients}
                toggleDrawer={toggleDrawer}
                state={state}
                dragStartHandler={dragStartHandler}
                dragOverHandler={dragOverHandler}
                dragLeaveHandler={dragLeaveHandler}
                dragEndHandler={dragEndHandler}
                dragDropHandler={dragDropHandler}
                deleteClient={deleteClient}
                translators={translators}
              />
            </div>
            <ClientsForm onFormSubmit={clientsFormSubmit} />
            <TranslatorsForm onFormSubmit={translatorsFormSubmit} />
            <div className={"socials add-translator-button middle-button"}>
              <Button
                aria-describedby={id}
                onClick={handleClick}
                fullWidth
                startIcon={<MonetizationOnIcon />}
              >
                Show total
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                className={"sum-popover"}
              >
                <Typography sx={{ p: 2 }}>
                  {`Total by ${moment().format("D MMMM")}: `}{" "}
                  <b>{`${calculateMonthTotal()} $`}</b>
                </Typography>
              </Popover>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div
        className={
          "inner-gallery-container translators-container animated-box scrolled-container"
        }
      >
        {translators.length && !loading ? (
          <AnimatedList animation={"grow"} initialAnimationDuration={5000}>
            {translators.map((item) => (
              <SingleTranslator
                deleteTranslator={startTranslatorDelete}
                {...item}
                key={item._id}
                dragOverHandler={dragOverHandler}
                onBoardDrop={onBoardDrop}
                dragLeaveHandler={dragLeaveHandler}
                balanceDaySubmit={balanceDaySubmit}
                alertStatusConfirmation={alertStatusConfirmation}
                openAlertConfirmation={openAlertConfirmation}
                closeAlertConfirmationNoReload={closeAlertConfirmationNoReload}
                calculateTranslatorMonthTotal={calculateTranslatorMonthTotal}
                calculateTranslatorYesterdayTotal={
                  calculateTranslatorYesterdayTotal
                }
                suspendTranslator={suspendTranslator}
                suspendClient={suspendClient}
              />
            ))}
          </AnimatedList>
        ) : loading ? (
          <div className="empty">
            <Loader />
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
      <AlertMessageConfirmation
        mainText={"Please confirm that you want to delete translator?"}
        additionalText={message.text}
        open={alertStatusConfirmation}
        handleClose={closeAlertConfirmationNoReload}
        handleOpen={openAlertConfirmation}
        status={false}
        onCancel={closeAlertConfirmationNoReload}
        onConfirm={finishTranslatorDelete}
      />
    </div>
  ) : (
    <Unauthorized />
  );
}

export default Translators;
