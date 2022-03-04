import { FormControl, MenuItem, Select } from "@material-ui/core";
import "../../styles/sharedComponents/YearSelected.css";
function YearSelect({ year, handleChange, arrayOfYears }) {
  return (
    <FormControl style={{ width: "95%" }}>
      <Select value={year} onChange={handleChange} >
        {arrayOfYears?.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default YearSelect;
