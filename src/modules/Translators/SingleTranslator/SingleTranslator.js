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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Typography } from "@material-ui/core";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import moment from "moment";
import { useSingleTranslator } from "../businessLogic";
import { findYesterday } from "../../../sharedFunctions/sharedFunctions";
import { currentMonth, currentYear } from "../../../constants/constants";
import { IconButton, Rating } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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
  suspendTranslator,
  suspended,
  suspendClient,
}) {
  const { calculateSumByClient, specialColorNeeded } =
    useSingleTranslator(statistics);

  return (
    <>
      <Card
        sx={{ minWidth: 275 }}
        className={
          suspended.status
            ? "translator-item translator-item--suspended"
            : "translator-item"
        }
        id={_id}
      >
        <IconButton
          className={"translator-item__suspend-button"}
          color={suspended.status ? "default" : "primary"}
          variant={"contained"}
          size={"small"}
          onClick={() => suspendTranslator(_id)}
          component="span"
        >
          {suspended.status ? <PersonAddAlt1Icon /> : <PersonRemoveIcon />}
        </IconButton>
        <CardContent>
          <Rating
            name="read-only"
            value={clients.length}
            readOnly
            size="small"
            max={6}
          />
          <Typography variant="h5" component="div">
            {`${name} ${surname}`}
          </Typography>
          <Typography variant="body1" align={"left"}>
            <i>Balance:</i>
          </Typography>
          <Typography variant="body2" align={"left"}>
            For {`${moment().format("MMMM")}: `}
            <b>{`${calculateTranslatorMonthTotal(statistics)} $`}</b>
          </Typography>
          <Typography variant="body2" align={"left"}>
            For {`yesterday: `}
            {calculateTranslatorYesterdayTotal(statistics) ? (
              <b>{`${calculateTranslatorYesterdayTotal(statistics)} $`}</b>
            ) : (
              "No data"
            )}
          </Typography>
          {suspended.time ? (
            <Typography variant="body2" align={"left"}>
              {suspended.status ? `Suspended since: ` : `Activated since: `}
              <b>{suspended.time}</b>
            </Typography>
          ) : null}
          {suspended.status ? null : (
            <div className="clients-box">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Active clients</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul
                    className={"clients-list"}
                    id={_id}
                    onDragOver={dragOverHandler}
                    onDragLeave={dragLeaveHandler}
                    onDrop={(e) => onBoardDrop(e, _id)}
                  >
                    {clients.filter((client) => !client.suspended).length ? (
                      clients
                        .filter((client) => !client.suspended)
                        .sort((a, b) => {
                          return (
                            Number(calculateSumByClient(b._id)) -
                            Number(calculateSumByClient(a._id))
                          );
                        })
                        .map((client) => (
                          <React.Fragment key={client._id}>
                            <li
                              className={"clients-list__name-container"}
                              id={client._id}
                            >
                              <p>{`${client.name} ${client.surname}`}</p>
                              <IconButton
                                color={"primary"}
                                variant={"contained"}
                                size={"small"}
                                onClick={() => suspendClient(_id, client._id)}
                                component="span"
                              >
                                <HighlightOffIcon />
                              </IconButton>
                            </li>
                            {Number(calculateSumByClient(client._id)) ? (
                              <li className={"clients-list__finance-container"}>
                                {`Balance for ${moment(
                                  `${findYesterday()}/${currentMonth}/${currentYear}`,
                                  "D/M/YYYY"
                                ).format("DD MMMM")}:`}{" "}
                                <b
                                  className={specialColorNeeded(client._id)}
                                >{`${calculateSumByClient(client._id)} $`}</b>
                              </li>
                            ) : (
                              <li className={"clients-list__finance-container"}>
                                No balance for yesterday
                              </li>
                            )}
                          </React.Fragment>
                        ))
                    ) : (
                      <p>Drag client here...</p>
                    )}
                  </ul>
                </AccordionDetails>
              </Accordion>
              {clients.filter((client) => client.suspended).length ? (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header-2"
                  >
                    <Typography>Suspended clients</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul className={"clients-list"} id={_id}>
                      {clients
                        .filter((client) => client.suspended)
                        .map((client) => (
                          <li
                            className={"clients-list__name-container"}
                            id={client._id}
                            key={client._id}
                          >
                            <p>{`${client.name} ${client.surname}`}</p>
                            <IconButton
                              color={"success"}
                              variant={"contained"}
                              size={"small"}
                              onClick={() => suspendClient(_id, client._id)}
                              component="span"
                            >
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </li>
                        ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              ) : null}
            </div>
          )}
        </CardContent>
        <CardActions>
          {clients.length && !suspended.status ? (
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
          <IconButton
            size={"small"}
            onClick={() => {
              deleteTranslator(_id);
            }}
            fullWidth
            variant="contained"
            color={suspended.status ? "default" : "primary"}
          >
            <DeleteSweepIcon />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
}

export default SingleTranslator;
