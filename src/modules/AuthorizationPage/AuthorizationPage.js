import React, { useState } from "react";
import "./AuthorizationPage.css";
import { Button, TextField } from "@material-ui/core";
import { PASSWORD } from "../../database/database";
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
const StyledButton = withStyles({
  root: {
    borderRadius: 3,
    border: 0,
    color: "#50C878",
    height: 48,
    padding: "0 30px",
    background:
      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(80,200,120,1) 100%)",
    boxShadow: "0 3px 5px 2px rgba(80, 200, 120, .3)",
    letterSpacing: "3px",
    fontWeight: "bold",
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);
const StyledInput = withStyles({
  root: {
    "& input:valid + fieldset": {
      borderColor: "orange",
      borderWidth: 2,
    },
    "&:focus": {
      border: "1px solid red",
      color: "red",
    },
  },
})(TextField);
function AuthorizationPage(props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const history = useHistory();
  function onChange(e) {
    if (error) {
      setError(false);
      setPassword(e.target.value.trim());
    } else {
      setPassword(e.target.value.trim());
    }
  }
  function onSubmit(e) {
    e.preventDefault();
    if (password === PASSWORD) {
      history.push("/clients/true");
    } else {
      setError(true);
    }
  }
  return (
    <div className={"authorization-container"}>
      <form action="" onSubmit={onSubmit}>
        <h2 className={"authorization-welcome"}>
          Please, enter password to proceed...
        </h2>
        <StyledInput
          error={error}
          id="outlined-password-input"
          label="Password"
          type="password"
          fullWidth
          autoComplete="current-password"
          variant="outlined"
          name={"password"}
          value={password}
          onChange={onChange}
        />
        <StyledButton
          variant="contained"
          fullWidth
          className={"enter-button"}
          type={"submit"}
        >
          Enter
        </StyledButton>
      </form>
    </div>
  );
}

export default AuthorizationPage;
