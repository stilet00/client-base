import React from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import moment from "moment";
import "./SingleTask.css";
import ColoredButton from "../../../shared/ColoredButton/ColoredButton";
function SingleTask({
  taskName,
  _id,
  onDelete,
  created,
  completed,
  onToggle,
  doneAt,
}) {
  function toggler() {
    let item = {
      _id: _id,
      taskName: taskName,
      completed: !completed,
      created: created,
      doneAt: moment().format("MMMM Do YYYY, h:mm:ss"),
    };
    onToggle(item);
  }
  let done = doneAt ? (
    <p className={"task-date done-text"}>Done: {doneAt}</p>
  ) : null;
  let toggleButton = !completed ? <DoneOutlineIcon /> : <DoneAllIcon />;
  return (
    <li
      id={_id}
      className={
        completed
          ? "item-container gallery-item completed"
          : "item-container gallery-item not-completed"
      }
    >
      <p className={"task-name"}>
        <b>{taskName}</b>
      </p>
      <p className={"task-date"}>Created: {created}</p>
      {done}
      <div className="button-container">
        <ColoredButton variant={"outlined"} onClick={() => onDelete(_id)} style={completed ? {backgroundColor: "rgb(255,145,0)"} : null}>
          <DeleteForeverIcon />
        </ColoredButton>
        <ColoredButton
          variant={"outlined"}
          onClick={toggler}
          disabled={completed}
        >
          {toggleButton}
        </ColoredButton>
      </div>
    </li>
  );
}

export default SingleTask;
