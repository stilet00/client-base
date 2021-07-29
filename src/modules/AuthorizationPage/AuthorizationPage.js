import React, { useState } from "react";
import "./AuthorizationPage.css";
import { Button, TextField } from "@material-ui/core";
import { PASSWORD } from "../../database/database";
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import Unauthorized from "../../shared/Unauthorized/Unauthorized";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: false, password: false });
  const history = useHistory();
  function onPasswordChange(e) {
    if (error.password) {
      setError({ ...error, password: false });
      setPassword(e.target.value.trim());
    } else {
      setPassword(e.target.value.trim());
    }
  }
  function onEmailChange(e) {
    if (error.email) {
      setError({ ...error, email: false });
      setEmail(e.target.value.trim());
    } else {
      setEmail(e.target.value.trim());
    }
  }
  function onSubmit(e) {
    e.preventDefault();
    signInWithEmailPassword();
  }
  function signInWithEmailPassword() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          return firebase.auth().signInWithEmailAndPassword(email, password);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage)
        });
  }

  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        if (isSignedIn) {
          history.push("/clients/");
        }
        return (
          <div className={"authorization-container"}>
            <form action="" onSubmit={onSubmit}>
              <h2 className={"authorization-welcome"}>
                Please, log in to proceed...
              </h2>
              <StyledInput
                error={error.email}
                label="Email"
                type="email"
                fullWidth
                autoComplete="current-password"
                variant="outlined"
                name={"email"}
                value={email}
                onChange={onEmailChange}
              />
              <StyledInput
                error={error.password}
                label="Password"
                type="password"
                fullWidth
                autoComplete="current-password"
                variant="outlined"
                name={"password"}
                value={password}
                onChange={onPasswordChange}
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
      }}
    </FirebaseAuthConsumer>
  );
}

export default AuthorizationPage;
