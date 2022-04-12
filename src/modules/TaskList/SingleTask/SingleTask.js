import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import moment from "moment";
import ColoredButton from "../../../sharedComponents/ColoredButton/ColoredButton";

function SingleTask({
  taskName,
  _id,
  onDelete,
  created,
  completed,
  onToggle,
  doneAt,
}) {
  const toggler = () => {
    let item = {
      _id: _id,
      taskName: taskName,
      completed: !completed,
      created: created,
      doneAt: moment().format("MMMM Do YYYY, h:mm:ss"),
    };
    onToggle(item);
  };

  let done = doneAt ? (
    <p className={"task-date done-text"}>Done: {doneAt}</p>
  ) : null;

  let toggleButton = !completed ? <DoneOutlineIcon /> : <DoneAllIcon />;

  return (
    <li
      id={_id}
      className={
        completed
          ? "task gallery-item completed"
          : "task gallery-item not-completed"
      }
    >
      <p className={"task-name"}>
        <b>{taskName}</b>
      </p>
      <p className={"task-date"}>Created: {created}</p>
      {done}
      <div className="button-container">
        <ColoredButton
          variant={"outlined"}
          onClick={() => onDelete(_id)}
          style={completed ? { backgroundColor: "rgba(255,255,255,1)" } : null}
        >
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
