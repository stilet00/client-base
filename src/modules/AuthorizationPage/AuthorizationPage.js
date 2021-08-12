import React, { useState } from "react";
import "./AuthorizationPage.css";
import { Button, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AlertMessage from "../../shared/AlertMessage/AlertMessage";
import { DEFAULT_ERROR } from "../../constants";
import { useAlert } from "../../shared/AlertMessage/hooks";
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
    "& label.Mui-focused": {
      color: "green",
    },
    "& label": {
      color: "green",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "green",
        borderWidth: 1,
      },
      "&:hover fieldset": {
        borderColor: "green",
      },
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
    },
  },
})(TextField);
function AuthorizationPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: DEFAULT_ERROR,
    password: DEFAULT_ERROR,
  });
  const history = useHistory();
  const { alertOpen, closeAlert, openAlert } = useAlert();
  function onPasswordChange(e) {
    if (error.password.status) {
      setError({ ...error, password: DEFAULT_ERROR });
      setPassword(e.target.value.trim());
    } else {
      setPassword(e.target.value.trim());
    }
  }
  function onEmailChange(e) {
    if (error.email) {
      setError({ ...error, email: DEFAULT_ERROR });
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
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
      })
      .catch((errorFromServer) => {
        const message = errorFromServer.message;
        const code = errorFromServer.code;
        console.log(errorFromServer);
        if (code === "auth/user-not-found") {
          setError({
            ...error,
            email: { ...error.email, text: message, status: true },
            password: { status: true, text: "" },
          });
        } else if (code === "auth/wrong-password") {
          setError({ ...error, password: { status: true, text: message } });
        } else if (code === "auth/too-many-requests") {
          setError({
            ...error,
            email: { ...error.email, text: message, status: true },
            password: { status: true, text: "" },
          });
        }

        openAlert();
        setTimeout(closeAlert, 5000);
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
                error={error.email.status}
                label="Email"
                type="email"
                fullWidth
                autoComplete="current-password"
                variant="outlined"
                name={"email"}
                value={email}
                onChange={onEmailChange}
                required
              />
              <StyledInput
                error={error.password.status}
                label="Password"
                type="password"
                fullWidth
                autoComplete="current-password"
                variant="outlined"
                name={"password"}
                value={password}
                onChange={onPasswordChange}
                required
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
            <AlertMessage
              mainText={"You've not been authorized :("}
              additionalText={error.email.text || error.password.text}
              open={alertOpen}
              handleOpen={openAlert}
              handleClose={closeAlert}
              status={true}
            />
          </div>
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default AuthorizationPage;
