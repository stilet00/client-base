import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ForumIcon from "@material-ui/icons/Forum";
import InputAdornment from "@material-ui/core/InputAdornment";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import "../../../styles/modules/EditBalanceForm.css";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SaveAsIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@material-ui/core/FormControl";
import DraftsIcon from "@material-ui/icons/Drafts";
import PhoneCallbackIcon from "@material-ui/icons/PhoneCallback";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import { useBalanceForm } from "../businessLogic";
import { calculateBalanceDaySum } from "../../../sharedFunctions/sharedFunctions";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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

export default function EditBalanceForm({
  balanceDaySubmit,
  statistics,
  name,
  surname,
  clients,
}) {
  const {
    handleOpen,
    open,
    handleClose,
    selectedYear,
    handleYear,
    selectedMonth,
    handleMonth,
    findYear,
    selectedDay,
    handleDay,
    findMonth,
    selectedClient,
    handleClient,
    handleChange,
    findClientById,
    onSavePressed,
    currentBalanceDay,
  } = useBalanceForm({
    balanceDaySubmit,
    statistics,
    clients,
  });
  const classes = useStyles();

  return (
    <>
      <Button
        type="button"
        size={"small"}
        onClick={handleOpen}
        fullWidth
        startIcon={<AttachMoneyIcon />}
      >
        Edit balance
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
          <div className={"form-container balance-form"}>
            <form>
              <h2 id="transition-modal-title">
                Statistics on {name + " " + surname}
              </h2>
              <p>Filters:</p>
              <div className={"balance-form__date"}>
                <Accordion className={"balance-form__date__accordion"}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Date filter</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel>Year</InputLabel>
                      <Select
                        value={selectedYear}
                        onChange={handleYear}
                        label="Year"
                        disabled
                      >
                        <MenuItem value={selectedYear}>{selectedYear}</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel htmlFor={"Month"}>Month</InputLabel>
                      <Select
                        value={selectedMonth}
                        onChange={handleMonth}
                        label="Month"
                      >
                        {findYear().months.map((item, index) => (
                          <MenuItem value={index + 1} key={index}>
                            {moment(index + 1, "M").format("MMMM")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel htmlFor={"Day"}>Day</InputLabel>
                      <Select
                        value={selectedDay}
                        onChange={handleDay}
                        label="Day"
                      >
                        {findMonth().map((item, index) => (
                          <MenuItem value={index + 1} key={index}>
                            {moment(index + 1, "D").format("DD")}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={selectedClient}
                    onChange={handleClient}
                    label="Client"
                  >
                    {clients.map((item) => (
                      <MenuItem value={item._id} key={item._id}>
                        {`${item.name} ${item.surname}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {currentBalanceDay.clients.length ? (
                <>
                  <p>Finances:</p>
                  <div className="balance-form__finances">
                    <div className="balance-form__finances__svadba">
                      <div className="balance-form__finances-input">
                        <CssTextField
                          name={"chats"}
                          onChange={handleChange}
                          onClick={(e) => e.target.select()}
                          value={findClientById().chats}
                          variant="outlined"
                          label={"Chats"}
                          type={"number"}
                          step="0.01"
                          fullWidth
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <ForumIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                      <div className="balance-form__finances-input">
                        <CssTextField
                          name={"letters"}
                          onChange={handleChange}
                          onClick={(e) => e.target.select()}
                          value={findClientById().letters}
                          variant="outlined"
                          label={"Letters"}
                          type={"number"}
                          step="0.01"
                          fullWidth
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <DraftsIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                      <div className="balance-form__finances-input">
                        <CssTextField
                          name={"virtualGiftsSvadba"}
                          onChange={handleChange}
                          onClick={(e) => e.target.select()}
                          value={findClientById().virtualGiftsSvadba}
                          variant="outlined"
                          label={"Virtual gifts"}
                          type={"number"}
                          step="0.01"
                          fullWidth
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <CardGiftcardIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                      <div className="balance-form__finances-input">
                        <CssTextField
                          name={"penalties"}
                          onChange={handleChange}
                          onClick={(e) => e.target.select()}
                          value={findClientById().penalties}
                          variant="outlined"
                          label={"Penalties"}
                          type={"number"}
                          step="0.01"
                          fullWidth
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <MoneyOffIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    </div>
                    <div className="balance-form__finances__dating">
                      <div className="balance-form__finances-input">
                        <CssTextField
                          name={"dating"}
                          onChange={handleChange}
                          onClick={(e) => e.target.select()}
                          value={findClientById().dating}
                          variant="outlined"
                          label={"Dating"}
                          type={"number"}
                          step="0.01"
                          fullWidth
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <ForumIcon /> Dating
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                      <div className="balance-form__finances-input">
                        <CssTextField
                          name={"phoneCalls"}
                          onChange={handleChange}
                          onClick={(e) => e.target.select()}
                          value={findClientById().phoneCalls}
                          variant="outlined"
                          label={"Phone calls"}
                          type={"number"}
                          step="0.01"
                          fullWidth
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <PhoneCallbackIcon /> Phone
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                      <div className="balance-form__finances-input">
                        <CssTextField
                          name={"virtualGiftsDating"}
                          onChange={handleChange}
                          onClick={(e) => e.target.select()}
                          value={findClientById().virtualGiftsDating}
                          variant="outlined"
                          label={"Virtual gifts dating"}
                          type={"number"}
                          step="0.01"
                          fullWidth
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <CardGiftcardIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p>
                    Day balance:{" "}
                    <b>
                      {calculateBalanceDaySum(findClientById()).toFixed(2) +
                        " $"}
                    </b>
                  </p>
                  <div className="balance-form__actions">
                    <Button
                      type={"button"}
                      variant={"outlined"}
                      onClick={onSavePressed}
                      className={"balance-form__actions--button"}
                      startIcon={<SaveAsIcon />}
                    >
                      Save changes
                    </Button>
                    <Button
                      type={"button"}
                      variant={"outlined"}
                      onClick={handleClose}
                      className={"balance-form__actions--button"}
                      startIcon={<CloseIcon />}
                    >
                      Close window
                    </Button>
                  </div>
                </>
              ) : (
                <Typography
                  className={"balance-form__no-data"}
                  variant="h5"
                  align={"center"}
                >
                  No clients were assigned by this date.
                </Typography>
              )}
            </form>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
