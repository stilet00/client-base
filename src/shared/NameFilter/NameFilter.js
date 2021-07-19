import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import "./NameFilter.css";

function NameFilter({ onChange, nameFilter }) {
  return (
    <div className={"filter-container"}>
      <Typography id="discrete-slider" gutterBottom className={"filter-label"}>
        Filter by name
      </Typography>
      <TextField
        id="outlined-basic"
        label="Filter by name"
        variant="outlined"
        fullWidth
        value={nameFilter}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default NameFilter;
