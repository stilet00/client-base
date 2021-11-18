import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import "./SumArray.css";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import InputAdornment from "@material-ui/core/InputAdornment";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import moment from "moment";
const CssTextField = withStyles({
  root: {
    "& .MuiInputBase-root:first-child": {
      background: "#fcfcfc",
    },
  },
})(TextField);

function SumArray({ getTotalDays, onInputChange, selectedMonth, currentYear, valuesStatus }) {
  const [isMultipleChecked, setIsMultipleChecked] = useState(false);
  function onCheckboxChange() {
    setIsMultipleChecked(!isMultipleChecked);
  }
  return (
    <div className={"checkbox-container"}>
      <FormControlLabel
        control={
          <Checkbox onChange={onCheckboxChange} checked={isMultipleChecked} />
        }
        label="Enter multiple data"
      />
      {valuesStatus ? <span className={"mass-data-flag green-text"}><b>Values added</b></span> : null}
      <div
        className={
          isMultipleChecked ? "data-input-table" : "data-input-table invisible"
        }
      >
        <table>
          <thead>
            <tr>
              <td colSpan={"2"} style={{ textAlign: "center" }}>
                Enter $ for dates
              </td>
            </tr>
            <tr>
              <td>Date</td>
              <td>Sum</td>
            </tr>
          </thead>
          <tbody>
            {getTotalDays().map((singleDay) => {
              return (
                <>
                  <tr>
                    <td>
                      {moment(`${currentYear}/${selectedMonth}/${singleDay}`).format("MMMM-DD")}
                    </td>
                    <td>
                      <CssTextField
                        variant="outlined"
                        type={"number"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <AttachMoneyIcon />
                            </InputAdornment>
                          ),
                        }}
                        id={singleDay}
                        onChange={onInputChange}
                      />
                    </td>
                  </tr>
                </>
              );
            })}
            <tr>
              <td colSpan={"2"}>
                <Button fullWidth onClick={onCheckboxChange}>
                  <SaveIcon />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SumArray;
