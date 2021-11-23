import React from "react";
import {
  makeStyles,
  ThemeProvider,
  createTheme,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  styledButton: {
    marginTop: theme.spacing(1),
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: "rgba(78, 205, 196, 1)",
    },
  },
});

export default function ColoredButton({
  innerContent,
  children,
  disabled,
  onClick,
  type,
  style,
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
          style={style}
        >
          {innerContent || children}
        </Button>
      </ThemeProvider>
    </div>
  );
}
