import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import "../../styles/sharedComponents/GalleryControls.css";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextFieldsIcon from "@mui/icons-material/TextFields";

function NameFilter({ onChange, nameFilter }) {
  return (
    <div className={"filter-container"}>
      <Typography id="discrete-slider" gutterBottom className={"filter-label"}>
        Filter by name
      </Typography>
      <TextField
        id="outlined-basic"
        variant="outlined"
        fullWidth
        value={nameFilter}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <TextFieldsIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export default NameFilter;
