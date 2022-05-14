import React from "react";
import Button from "@material-ui/core/Button";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Drawer from "@material-ui/core/Drawer";
import WomanIcon from "@mui/icons-material/Woman";
import ListItemText from "@material-ui/core/ListItemText";
import "../../../styles/modules/Clients.css";
import { useClientsList } from "../businessLogic";
import moment from "moment";
import { Rating } from "@mui/material";
import {
  calculatePercentDifference,
  calculateTranslatorMonthTotal,
} from "../../../sharedFunctions/sharedFunctions";
import { previousMonth } from "../../../constants/constants";

function ClientsList({
  translators,
  clients,
  toggleDrawer,
  state,
  dragStartHandler,
  dragOverHandler,
  dragLeaveHandler,
  dragEndHandler,
  dragDropHandler,
}) {
  const {
    clientMonthSum,
    sortBySum,
    getClientsRating,
    calculateMiddleMonthSum,
  } = useClientsList(translators);

  return (
    <>
      <Button
        onClick={toggleDrawer("left", true)}
        fullWidth
        startIcon={<ListAltIcon />}
      >
        Show clients
      </Button>
      <Drawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
      >
        <div className={"side-clients-menu fallDown-menu"}>
          <h3>
            <WomanIcon />
            All clients:
          </h3>
          <ul>
            {clients.sort(sortBySum).map((client) => {
              const progressPage =
                calculateMiddleMonthSum(client._id) >=
                calculateMiddleMonthSum(
                  client._id,
                  moment().subtract(1, "month")
                ) ? (
                  <span>
                    {`Middle for ${moment().format("MMMM")}: `}
                    <span className={"blue-text"}>
                      {`${calculateMiddleMonthSum(client._id)} $`}
                    </span>
                    <span className={"green-text"}>
                      {` +${calculatePercentDifference(
                        calculateMiddleMonthSum(client._id),
                        calculateMiddleMonthSum(
                          client._id,
                          moment().subtract(1, "month")
                        )
                      )} %`}
                    </span>
                  </span>
                ) : (
                  <span>
                    {`Middle for ${moment().format("MMMM")}: `}
                    <span className={"blue-text"}>
                      {`${calculateMiddleMonthSum(client._id)} $`}
                    </span>
                    <span className={"red-text"}>
                      {` -${calculatePercentDifference(
                        calculateMiddleMonthSum(client._id),
                        calculateMiddleMonthSum(
                          client._id,
                          moment().subtract(1, "month")
                        )
                      )} %`}
                    </span>
                  </span>
                );
              const totalPage = (
                <span>
                  {`Balance for ${moment().format("MMMM")}: `}
                  <span className={"blue-text"}>
                    {`${clientMonthSum(client._id)} $`}
                  </span>
                </span>
              );

              const previousTotalPage = (
                <span>
                  {`Balance for ${moment()
                    .subtract(1, "month")
                    .format("MMMM")}: `}
                  <span className={"blue-text"}>
                    {`${clientMonthSum(
                      client._id,
                      moment().subtract(1, "month")
                    )} $`}
                  </span>
                </span>
              );
              return (
                <li
                  key={client._id}
                  id={client._id}
                  className={"side-clients-menu__client"}
                  draggable={true}
                  onDragStart={(e) => dragStartHandler(e, client)}
                  onDragOver={dragOverHandler}
                  onDragLeave={dragLeaveHandler}
                  onDragEnd={dragEndHandler}
                  onDrop={(e) => dragDropHandler(e)}
                >
                  <ListItemText primary={`${client.name} ${client.surname}`} />
                  <Rating
                    name="read-only"
                    value={getClientsRating(client._id)}
                    readOnly
                    size="small"
                  />
                  {/*<Button onClick={() => deleteClient(client._id)} disabled>*/}
                  {/*  <DeleteForeverIcon />*/}
                  {/*</Button>*/}
                  <ListItemText
                    className={"side-clients-menu__client__balance-container"}
                    secondary={totalPage}
                  ></ListItemText>
                  <ListItemText
                    className={"side-clients-menu__client__balance-container"}
                    secondary={progressPage}
                  />
                  <ListItemText
                    className={"side-clients-menu__client__balance-container"}
                    secondary={previousTotalPage}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </Drawer>
    </>
  );
}

export default ClientsList;
