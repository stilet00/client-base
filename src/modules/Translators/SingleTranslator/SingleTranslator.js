import React from "react";
import "../../../styles/modules/SingleTranslator.css";
import { Button } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
function SingleTranslator({
  name,
  surname,
  clients,
  _id,
  dragOverHandler,
  onBoardDrop,
  dragLeaveHandler,
  deleteTranslator,
}) {
  const clientsInner =
    clients.length > 0 ? (
      clients.map((client) => (
        <li key={client._id}>
          <p>{`${client.name} ${client.surname}`}</p>
        </li>
      ))
    ) : (
      <p>Drag client here...</p>
    );

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
          {clientsInner}
        </ul>
      </div>
      <Button onClick={() => deleteTranslator(_id)}>
        <DeleteForeverIcon />
      </Button>
    </div>
  );
}

export default SingleTranslator;
