import React from "react";
import "./SingleTranslator.css";
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
  return (
    <div className={"gallery-item translator-item"}>
      <h4>{name + " " + surname}</h4>
      <p>Clients in work:</p>
      <div className="clients-box">
        <ul
          className={"clients-list"}
          id={_id}
          onDragOver={dragOverHandler}
          onDragLeave={dragLeaveHandler}
          onDrop={(e) => onBoardDrop(e, _id)}
        >
          {clients.map((client) => (
            <li key={client._id}>
              <p>{`${client.name} ${client.surname}`}</p>
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={() => deleteTranslator(_id)}>
        <DeleteForeverIcon />
      </Button>
    </div>
  );
}

export default SingleTranslator;
