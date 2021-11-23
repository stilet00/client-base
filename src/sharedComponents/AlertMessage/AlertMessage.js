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

export default function AlertMessage({
  mainText,
  additionalText,
  handleClose,
  open,
  status,
}) {
  const classes = useStyles();

  return (
    <div>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <div
          className={
            status ? "message-container green-box" : "message-container red-box"
          }
        >
          <h2 className={status ? "green-text" : "red-text"}>{mainText}</h2>
          {additionalText ? <p>{additionalText}</p> : null}
        </div>
      </Modal>
    </div>
  );
}
