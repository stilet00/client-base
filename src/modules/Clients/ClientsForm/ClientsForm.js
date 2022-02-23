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
import "../../../styles/modules/ClientsForm.css";
import { DEFAULT_CLIENT } from "../../../constants/constants";
import { useAlert } from "../../../sharedComponents/AlertMessage/hooks";
import StarsIcon from "@material-ui/icons/Stars";
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

export default function ClientsForm({ onFormSubmit, editedClient }) {
  const classes = useStyles();

  const [client, setClient] = useState(editedClient || DEFAULT_CLIENT);

  const { handleClose, handleOpen, open } = useModal();

  const handleChange = useCallback(
    (e) => {
      setClient({ ...client, [e.target.name]: e.target.value.trim() });
    },
    [client]
  );

  function clearClient() {
    setClient(DEFAULT_CLIENT);
  }

  return (
    <div className={"socials add-client-button middle-button"}>
      <StarsIcon />
      <Button type="button" onClick={handleOpen} fullWidth>
        Add client
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
                onFormSubmit(e, client);
                clearClient();
                setTimeout(handleClose, 1100);
              }}
            >
              <h2 id="transition-modal-title">
                Enter client's name and surname:
              </h2>
              <CssTextField
                name={"name"}
                onChange={handleChange}
                value={client.name}
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
                value={client.surname}
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
              {/*<CssTextField*/}
              {/*  name={"instagram"}*/}
              {/*  onChange={handleChange}*/}
              {/*  value={client.instagram}*/}
              {/*  variant="outlined"*/}
              {/*  label={"Instagram"}*/}
              {/*  fullWidth*/}
              {/*  InputProps={{*/}
              {/*    startAdornment: (*/}
              {/*      <InputAdornment position="start">*/}
              {/*        <InstagramIcon />*/}
              {/*      </InputAdornment>*/}
              {/*    ),*/}
              {/*  }}*/}
              {/*/>*/}
              {/*<CssTextField*/}
              {/*  name={"onlyFans"}*/}
              {/*  onChange={handleChange}*/}
              {/*  value={client.onlyFans}*/}
              {/*  variant="outlined"*/}
              {/*  label={"Onlyfans"}*/}
              {/*  fullWidth*/}
              {/*  InputProps={{*/}
              {/*    startAdornment: (*/}
              {/*      <InputAdornment position="start">*/}
              {/*        <LockIcon />*/}
              {/*      </InputAdornment>*/}
              {/*    ),*/}
              {/*  }}*/}
              {/*/>*/}
              {/*<div className={"upload-container"}>*/}
              {/*  <input*/}
              {/*    type="file"*/}
              {/*    ref={fileInput}*/}
              {/*    accept={"image/jpeg,image/png,image/gif"}*/}
              {/*    className={"photo-input"}*/}
              {/*    onChange={() => createThumbnail(fileInput.current.files[0])}*/}
              {/*    name={"image"}*/}
              {/*  />*/}
              {/*  <ImageIcon fontSize={"large"} className={"photo-icon"} />*/}
              {/*</div>*/}
              {/*{previewImage}*/}
              <Button type={"submit"} fullWidth variant={"outlined"}>
                Add client
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
