import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import "./Form.css";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

}));
const CssTextField = withStyles({
  root: {
    "& .MuiInputBase-root": {
      marginBottom: "10px"
      // background: "#50C878",
    },
  },
})(TextField);

export default function Form({ addTask }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function onInputChange(e) {
    setTaskName(e.target.value.trim());
  }
  return (
    <div className={"modal-wrapper"}>
      <Button type="button" onClick={handleOpen} fullWidth>
        <AddIcon />
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={"form-container"}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTask(taskName);
                handleClose();
              }}
            >
              <h2 id="transition-modal-title">Enter task name:</h2>
              <CssTextField
                id="filled-basic"
                label="Task"
                variant="outlined"
                fullWidth
                onChange={onInputChange}
                multiline
                rows={3}

              />
              <Button type={"submit"} fullWidth variant={"outlined"}>
                Add task
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
