import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import "./Slider.css";
// const useStyles = makeStyles({
//     root: {
//         width: 500,
//     }
//
// });
const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));
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
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom className={"filter-label"}>
        Filter by age
      </Typography>
      <PrettoSlider
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={18}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        // marks
        min={18}
        max={50}
      />
      {/*<Slider*/}
      {/*    defaultValue={18}*/}
      {/*    getAriaValueText={valuetext}*/}
      {/*    aria-labelledby="discrete-slider"*/}
      {/*    valueLabelDisplay="auto"*/}
      {/*    step={1}*/}
      {/*    marks*/}
      {/*    min={18}*/}
      {/*    max={50}*/}
      {/*/>*/}
    </div>
  );
}
