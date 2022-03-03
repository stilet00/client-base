import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CheckIcon from "@material-ui/icons/Check";
import ColoredButton from "../../../sharedComponents/ColoredButton/ColoredButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import {useChartDateForm} from "../businessLogic";

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

export default function ChartDateForm(props) {
  const classes = useStyles();

  const { monthData,
          handleOpen,
          handleClose,
          open,
          handleChange,
          onSubmit,
          onInputChange,
          selectedDate,
          value } = useChartDateForm(props);

  return (
    <div className={"date-wrapper"}>
      <ColoredButton type="button" onClick={handleOpen} variant={"outlined"}>
        <AddBoxIcon />
      </ColoredButton>
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
          <div className={"form-container chart-date-form"}>
            <form
              onSubmit={onSubmit}
            >
              <h2 id="transition-modal-title">Enter parameters:</h2>
              <CssTextField
                value={monthData.title}
                variant="outlined"
                fullWidth
                disabled
                label={"Date"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel>Day of the month</InputLabel>
                <Select
                  value={selectedDate}
                  onChange={handleChange}
                  label="Day of the month"
                >
                  {monthData.labels.map((day) => (
                    <MenuItem value={String(day)} key={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <CssTextField
                value={value}
                variant="outlined"
                label={"Summ"}
                fullWidth
                type={"number"}
                onChange={onInputChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button type={"submit"} fullWidth variant={"outlined"}>
                Add sum by this day <CheckIcon />
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
