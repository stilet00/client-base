import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./AlertMessageConfirmation.css";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function AlertMessageConfirmation({
  mainText,
  additionalText,
  handleClose,
  open,
  status,
  onConfirm,
  onCancel,
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
          <div className="confirmation-buttons">
            <Button
              variant={"outlined"}
              color={"secondary"}
              onClick={onConfirm}
            >
              DELETE
            </Button>
            <Button variant={"outlined"} color={"primary"} onClick={onCancel}>
              CANCEL
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
