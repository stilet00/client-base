import React, { useCallback, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";
import InputAdornment from "@material-ui/core/InputAdornment";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import "./TranslatorsForm.css";
import { DEFAULT_TRANSLATOR } from "../../../constants/constants";
import AlertMessage from "../../../sharedComponents/AlertMessage/AlertMessage";
import { useAlert } from "../../../sharedComponents/AlertMessage/hooks";
import AirlineSeatReclineNormalIcon from "@material-ui/icons/AirlineSeatReclineNormal";
import useModal from "../../../sharedHooks/useModal";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
const CssTextField = withStyles({
  root: {
    "& .MuiInputBase-root:first-child": {
      background: "rgba(210,206,206,0.5)",
    },
  },
})(TextField);

export default function TranslatorsForm({ onFormSubmit, editedTranslator }) {
  const classes = useStyles();
  const [translator, setTranslator] = useState(
    editedTranslator || DEFAULT_TRANSLATOR
  );
  const { open, handleOpen, handleClose } = useModal();
  const { alertOpen, closeAlert, openAlert } = useAlert();
  const handleChange = useCallback(
    (e) => {
      setTranslator({ ...translator, [e.target.name]: e.target.value.trim() });
    },
    [translator]
  );
  function clearTranslator() {
    setTranslator(DEFAULT_TRANSLATOR);
  }
  return (
    <div className={"socials add-translator-button bottom-button"}>
      <AirlineSeatReclineNormalIcon />
      <Button type="button" onClick={handleOpen} fullWidth>
        Add translator
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
          <div className={"form-container clients-form"}>
            <form
              onSubmit={(e) => {
                openAlert();
                onFormSubmit(e, translator);
                setTimeout(closeAlert, 1000);
                clearTranslator();
                setTimeout(handleClose, 1100);
              }}
            >
              <h2 id="transition-modal-title">
                Enter translator's name and surname:
              </h2>
              <CssTextField
                name={"name"}
                onChange={handleChange}
                value={translator.name}
                variant="outlined"
                label={"Name"}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <CssTextField
                name={"surname"}
                onChange={handleChange}
                value={translator.surname}
                variant="outlined"
                label={"Surname"}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIndIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <AlertMessage
                mainText={"Translator has been added!"}
                open={alertOpen}
                handleOpen={openAlert}
                handleClose={closeAlert}
                status={true}
              />
              <Button type={"submit"} fullWidth variant={"outlined"}>
                Add translator
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
