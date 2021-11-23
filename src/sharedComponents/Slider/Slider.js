import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import "./Slider.css";

const PrettoSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8,
    width: 290,
    marginTop: "none",
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export default function DiscreteSlider({ valuetext }) {
  return (
    <div className={"filter-container"}>
      <Typography id="discrete-slider" gutterBottom className={"filter-label"}>
        Filter by age
      </Typography>
      <PrettoSlider
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={18}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        step={1}
        // marks
        min={18}
        max={50}
      />
    </div>
  );
}
