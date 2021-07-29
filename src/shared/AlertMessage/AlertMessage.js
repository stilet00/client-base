import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./AlertMessage.css";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function AlertMessage({ text, handleOpen, handleClose, open }) {
  const classes = useStyles();

  return (
    <div>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <div className={"message-container"}>
          <h2>You've not been authorized :(</h2>
          <p>{text}</p>
        </div>
      </Modal>
    </div>
  );
}
