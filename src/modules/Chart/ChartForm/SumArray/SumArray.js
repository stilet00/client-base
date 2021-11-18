import React, { useState } from 'react';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import "./SumArray.css";
import Button from "@material-ui/core/Button";
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
function SumArray ( { getTotalDays, onInputChange }) {
    const [isMultipleChecked, setIsMultipleChecked] = useState(false);
    function onCheckboxChange () {
        setIsMultipleChecked(!isMultipleChecked)
    }

    return (
        <div className={"checkbox-container"}>
                <FormControlLabel control={<Checkbox onChange={onCheckboxChange}/>} label="Enter multiple data" />
                <div className={isMultipleChecked ? "data-input-table" : "data-input-table invisible"}>
                    <table>
                        <thead>
                        <tr>
                            <td colSpan={"2"} style={{textAlign: "center"}}>Enter $ for dates</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>Sum</td>
                        </tr>
                        </thead>
                        <tbody>
                        {getTotalDays().map(singleDay => {
                            return (
                                <>
                                    <tr>
                                        <td>{singleDay}</td>
                                        <td><input type={"number"} id={singleDay} onChange={onInputChange} className={"value-input"}/></td>
                                    </tr>
                                </>
                            )
                        })}
                        <tr>
                            <td colSpan={"2"}>
                                <Button fullWidth onClick={onCheckboxChange}>
                                    <SaveIcon />
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={"2"}>
                                <Button fullWidth onClick={onCheckboxChange}>
                                    <ClearIcon />
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