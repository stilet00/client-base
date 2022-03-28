import React from "react";
import "../../../styles/modules/SingleTranslator.css";
import { Button } from "@material-ui/core";
import EditBalanceForm from "../EditBalanceForm/EditBalanceForm";
import DeleteIcon from "@material-ui/icons/Delete";

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
}) {
  return (
    <div className={"gallery-item translator-item"}>
      <div className={"name-table"}>
        <p>Name:</p>
        <p className={"value"}>
          <b>{name}</b>
        </p>
        <p>Surname:</p>
        <p className={"value"}>
          <b>{surname}</b>
        </p>
      </div>
      <p>
        <b>Clients in work:</b>
      </p>
      <div className="clients-box">
        <ul
          className={"clients-list"}
          id={_id}
          onDragOver={dragOverHandler}
          onDragLeave={dragLeaveHandler}
          onDrop={(e) => onBoardDrop(e, _id)}
        >
          {clients.length > 0 ? (
            clients.map((client) => (
              <li key={client._id} className={"clients-list__name-container"}>
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
      </div>
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
        onClick={() => {
          deleteTranslator(_id);
        }}
        fullWidth
        style={{
          color: "red",
        }}
      >
        Delete translator
      </Button>
    </div>
  );
}

export default SingleTranslator;
