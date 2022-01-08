import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import moment from "moment";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import InputAdornment from "@material-ui/core/InputAdornment";
import SumArray from "../../../sharedComponents/SumArray/SumArray";
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

export default function ChartForm({ onMonthSubmit, year }) {
  const classes = useStyles();
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [valuesArray, setValuesArray] = useState([]);
  const { handleClose, handleOpen, open } = useModal();
  useEffect(() => {
    let monthsArray = [];
    for (let i = 1; i < 13; i++) {
      i < 10
        ? monthsArray.push(
            moment("01-0" + i + "-" + year, "DD-MM-YYYY").format("MMMM")
          )
        : monthsArray.push(
            moment("01-" + i + "-" + year, "DD-MM-YYYY").format("MMMM")
          );
    }
    setMonths(monthsArray);
  }, [year]);
  const handleChange = useCallback((event) => {
    setSelectedMonth(event.target.value);
  }, []);
  const getTotalDays = useCallback(() => {
    const stringMonth = selectedMonth < 9 ? "0" + selectedMonth : selectedMonth;
    let totalDays = [];
    for (
      let i = 1;
      i <= moment(year + "-" + stringMonth, "YYYY-MM").daysInMonth();
      i++
    ) {
      totalDays.push(i);
    }
    return totalDays;
  }, [selectedMonth, year]);

  const onFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let submittedMonth = {
        year: year,
        month: selectedMonth < 10 ? "0" + selectedMonth : String(selectedMonth),
        days: getTotalDays(),
        values: valuesArray,
      };
      onMonthSubmit(submittedMonth);
      setDefault();
    },
    [year, selectedMonth, valuesArray]
  );

  const setDefault = useCallback(() => {
    handleClose();
    let monthsArray = [];
    for (let i = 1; i < 13; i++) {
      i < 10
        ? monthsArray.push(
            moment("01-0" + i + "-" + year, "DD-MM-YYYY").format("MMMM")
          )
        : monthsArray.push(
            moment("01-" + i + "-" + year, "DD-MM-YYYY").format("MMMM")
          );
    }
    setMonths(monthsArray);
    setSelectedMonth(1);
    setValuesArray([]);
  }, []);
  const onValuesSubmit = useCallback((newValuesArray) => {
    setValuesArray(newValuesArray);
  }, []);
  return (
    <div className={"modal-wrapper"}>
      <Button type="button" onClick={handleOpen} fullWidth>
        Add month
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
          <div className={"form-container chart-form"}>
            <form onSubmit={onFormSubmit}>
              <h2 id="transition-modal-title">Enter parameters:</h2>
              <CssTextField
                id="filled-basic"
                value={year}
                variant="outlined"
                fullWidth
                type={"number"}
                disabled
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
                <InputLabel id="demo-simple-select-outlined-label">
                  Month
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={selectedMonth}
                  onChange={handleChange}
                  label="Month"
                >
                  <MenuItem value="" disabled>
                    <em>None</em>
                  </MenuItem>
                  {months.map((month, index) => (
                    <MenuItem value={index + 1} key={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <SumArray
                getTotalDays={getTotalDays}
                selectedMonth={selectedMonth}
                onSubmit={onValuesSubmit}
                year={year}
                valuesStatus={valuesArray.length > 0}
              />
              <Button type={"submit"} fullWidth variant={"outlined"}>
                Add chart
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
