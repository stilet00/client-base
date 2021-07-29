import React from "react";
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  styledButton: {
    marginTop: theme.spacing(1),
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

export default function ColoredButton({
  innerContent,
  children,
  disabled,
  onClick,
  type,
}) {
  const classes = useStyles();

  return (
    <div className={"green-button-container"}>
      <ThemeProvider theme={theme}>
        <Button
          variant="contained"
          color="primary"
          className={classes.styledButton}
          disabled={disabled}
          onClick={onClick}
          type={type}
          fullWidth
        >
          {innerContent || children}
        </Button>
      </ThemeProvider>
    </div>
  );
}
