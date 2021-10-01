import React from 'react';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import "./SumArray.css";
function SumArray ( { onCheckboxChange, isMultipleChecked, getTotalDays, selectedMonth }) {
    console.log(selectedMonth)
    return (
        <div className={"checkbox-container"}>
                <FormControlLabel control={<Checkbox onChange={onCheckboxChange}/>} label="Enter multiple data" />
                <table>
                    <thead>
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
                                    <td><input type={"number"}/></td>
                                </tr>
                            </>
                        )
                    })}
                    </tbody>
                </table>
        </div>
    );
}

export default SumArray;