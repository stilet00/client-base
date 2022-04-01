import React from "react";
import "../../../styles/modules/SingleTranslator.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActions,
  CardContent,
} from "@material-ui/core";
import EditBalanceForm from "../EditBalanceForm/EditBalanceForm";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import StarIcon from "@material-ui/icons/Star";
import { Typography } from "@material-ui/core";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import moment from "moment";

function SingleTranslator({
  name,
  surname,
  clients,
  _id,
  statistics,
  dragOverHandler,
  onBoardDrop,
  dragLeaveHandler,
  deleteTranslator,
  balanceDaySubmit,
  calculateTranslatorMonthTotal,
  calculateTranslatorYesterdayTotal,
}) {
  return (
    <>
      <Card sx={{ minWidth: 275 }} className={"translator-item"}>
        <CardContent>
          {clients.map((item) => (
            <StarIcon key={item._id} fontSize={"small"} color={"disabled"} />
          ))}
          <Typography variant="h5" component="div">
            {`${name} ${surname}`}
          </Typography>
          <div>
            <div className="clients-box">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Clients</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul
                    className={"clients-list"}
                    id={_id}
                    onDragOver={dragOverHandler}
                    onDragLeave={dragLeaveHandler}
                    onDrop={(e) => onBoardDrop(e, _id)}
                  >
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <li
                          key={client._id}
                          className={"clients-list__name-container"}
                        >
                          <p>{`${client.name} ${client.surname}`}</p>
                          {/*<div className="clients-list__action-buttons">*/}
                          {/*  <button type="button">*/}
                          {/*    <DeleteIcon />*/}
                          {/*  </button>*/}
                          {/*</div>*/}
                        </li>
                      ))
                    ) : (
                      <p>Drag client here...</p>
                    )}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
          <Typography variant="body1" align={"left"}>
            <b>Total:</b>
          </Typography>
          <Typography variant="body2" align={"left"}>
            For{" "}
            {`${moment().format("MMMM")}: ${calculateTranslatorMonthTotal(
              statistics
            )}$`}
            {/*<br />*/}
            {/*{'"a benevolent smile"'}*/}
          </Typography>
          <Typography variant="body2" align={"left"}>
            For {`yesterday: ${calculateTranslatorYesterdayTotal(statistics)}$`}
            {/*<br />*/}
            {/*{'"a benevolent smile"'}*/}
          </Typography>
        </CardContent>
        <CardActions>
          {clients.length ? (
            <EditBalanceForm
              balanceDaySubmit={(balanceDay) =>
                balanceDaySubmit(_id, balanceDay)
              }
              name={name}
              surname={surname}
              statistics={statistics}
              clients={clients}
              id={_id}
            />
          ) : null}
          <Button
            size={"small"}
            onClick={() => {
              deleteTranslator(_id);
            }}
            fullWidth
            style={{
              color: "red",
            }}
            startIcon={<DeleteSweepIcon />}
          >
            Delete translator
          </Button>
        </CardActions>
      </Card>
      {/*<div className={"name-table"}>*/}
      {/*  <p>Name:</p>*/}
      {/*  <p className={"value"}>*/}
      {/*      {name}*/}
      {/*  </p>*/}
      {/*  <p>Surname:</p>*/}
      {/*  <p className={"value"}>*/}
      {/*    {surname}*/}
      {/*  </p>*/}
      {/*</div>*/}
      {/*<p>*/}
      {/*  <b>Clients in work:</b>*/}
      {/*</p>*/}
      {/*<div className="clients-box">*/}
      {/*    <Accordion>*/}
      {/*        <AccordionSummary*/}
      {/*            expandIcon={<ExpandMoreIcon />}*/}
      {/*            aria-controls="panel1a-content"*/}
      {/*            id="panel1a-header"*/}
      {/*        >*/}
      {/*            <Typography>Clients</Typography>*/}
      {/*        </AccordionSummary>*/}
      {/*        <AccordionDetails>*/}
      {/*            <ul*/}
      {/*                className={"clients-list"}*/}
      {/*                id={_id}*/}
      {/*                onDragOver={dragOverHandler}*/}
      {/*                onDragLeave={dragLeaveHandler}*/}
      {/*                onDrop={(e) => onBoardDrop(e, _id)}*/}
      {/*            >*/}
      {/*                {clients.length > 0 ? (*/}
      {/*                    clients.map((client) => (*/}
      {/*                        <li key={client._id} className={"clients-list__name-container"}>*/}
      {/*                            <p>{`${client.name} ${client.surname}`}</p>*/}
      {/*                            /!*<div className="clients-list__action-buttons">*!/*/}
      {/*                            /!*  <button type="button">*!/*/}
      {/*                            /!*    <DeleteIcon />*!/*/}
      {/*                            /!*  </button>*!/*/}
      {/*                            /!*</div>*!/*/}
      {/*                        </li>*/}
      {/*                    ))*/}
      {/*                ) : (*/}
      {/*                    <p>Drag client here...</p>*/}
      {/*                )}*/}
      {/*            </ul>*/}
      {/*        </AccordionDetails>*/}
      {/*    </Accordion>*/}
      {/*</div>*/}
      {/*{clients.length ? (*/}
      {/*  <EditBalanceForm*/}
      {/*    balanceDaySubmit={(balanceDay) =>*/}
      {/*      balanceDaySubmit(_id, balanceDay)*/}
      {/*    }*/}
      {/*    name={name}*/}
      {/*    surname={surname}*/}
      {/*    statistics={statistics}*/}
      {/*    clients={clients}*/}
      {/*    id={_id}*/}
      {/*  />*/}
      {/*) : null}*/}
      {/*<Button*/}
      {/*  onClick={() => {*/}
      {/*    deleteTranslator(_id);*/}
      {/*  }}*/}
      {/*  fullWidth*/}
      {/*  style={{*/}
      {/*    color: "red",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  Delete translator*/}
      {/*</Button>*/}
    </>
  );
}

export default SingleTranslator;
