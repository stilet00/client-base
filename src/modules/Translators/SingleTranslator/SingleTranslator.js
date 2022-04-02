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
import { useSingleTranslator } from "../businessLogic";
import { findYesterday } from "../../../sharedFunctions/sharedFunctions";
import { currentMonth, currentYear } from "../../../constants/constants";

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

  const { calculateSumByClient } = useSingleTranslator(statistics);

  return (
    <>
      <Card sx={{ minWidth: 275 }} className={"translator-item"}>
        <CardContent>
          {clients.map((item) => (
            <StarIcon key={item._id} fontSize={"small"} color={"disabled"}  color={"primary"}/>
          ))}
          <Typography variant="h5" component="div">
            {`${name} ${surname}`}
          </Typography>
          <Typography variant="body1" align={"left"}>
            <i>Balance:</i>
          </Typography>
          <Typography variant="body2" align={"left"}>
            For{" "}
            {`${moment().format("MMMM")}: `}<b>{`${calculateTranslatorMonthTotal(
              statistics
          )} $`}</b>
          </Typography>
          <Typography variant="body2" align={"left"}>
            For {`yesterday: `}
            {
              calculateTranslatorYesterdayTotal(statistics)  ? <b>{ `${calculateTranslatorYesterdayTotal(statistics)} $` }</b> : "No data"
            }
          </Typography>
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
                          <React.Fragment
                              key={client._id}>
                            <li
                                className={"clients-list__name-container"}
                            >
                              <p>{`${client.name} ${client.surname}`}</p>
                              {/*<div className="clients-list__action-buttons">*/}
                              {/*  <button type="button">*/}
                              {/*    <DeleteIcon />*/}
                              {/*  </button>*/}
                              {/*</div>*/}
                            </li>
                            <li className={"clients-list__finance-container"}>
                              {`Balance for ${moment(`${findYesterday()}/${currentMonth}/${currentYear}`, "D/M/YYYY" ).format("DD MMMM")}:`} <b>{ `${calculateSumByClient(client._id)} $` }</b>
                            </li>
                          </React.Fragment>
                      ))
                  ) : (
                      <p>Drag client here...</p>
                  )}
                </ul>
              </AccordionDetails>
            </Accordion>
          </div>
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
    </>
  );
}

export default SingleTranslator;
