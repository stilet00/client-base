import React from "react";
import Button from "@material-ui/core/Button";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Drawer from "@material-ui/core/Drawer";
import WomanIcon from "@mui/icons-material/Woman";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "../../../styles/modules/Clients.css";
import { useClientsList } from "../businessLogic";
import moment from "moment";
import { Rating } from "@mui/material";

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
  deleteClient,
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
            {clients.sort(sortBySum).map((client) => (
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
                  secondary={`Balance for ${moment().format(
                    "MMMM"
                  )}: ${clientMonthSum(client._id)} $`}
                />
                <ListItemText
                  className={"side-clients-menu__client__balance-container"}
                  secondary={`Middle for ${moment().format(
                    "MMMM"
                  )}: ${calculateMiddleMonthSum(client._id)} $`}
                />
              </li>
            ))}
          </ul>
        </div>
      </Drawer>
    </>
  );
}

export default ClientsList;
