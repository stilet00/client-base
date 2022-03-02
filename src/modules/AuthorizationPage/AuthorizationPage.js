import React, { useCallback, useState } from "react";
import "../../styles/modules/AuthorizationPage.css";
import { Button, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { DEFAULT_ERROR } from "../../constants";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";

const StyledButton = withStyles({
  root: {
    borderRadius: 3,
    border: 0,
    color: "black",
    height: 48,
    padding: "0 30px",
    background:
      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(78, 205, 196, 1) 100%)",
    boxShadow: "none",
    letterSpacing: "3px",
    fontWeight: "bold",
    "&:hover": {
      boxShadow: "0 2px 2px rgba(41, 241, 195, 1)",
    },
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);

const StyledInput = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "black",
    },
    "& label": {
      top: "-5px",
      left: "-5px",
      boxSizing: "border box",
      padding: "5px 7px",
      border: "1px solid black",
      borderRadius: "5px",
      color: "black",
      backgroundColor: "rgba(255, 255, 255, 1)"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "black",
    },
    "& .MuiOutlinedInput-root": {
      background: "#D8E6F3",
      boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      "& fieldset": {
        borderColor: "black",
        borderWidth: 1,
      },
      "&:hover fieldset": {
        borderColor: "black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },
    },
  },
})(TextField);

function AuthorizationPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState({
    email: DEFAULT_ERROR,
    password: DEFAULT_ERROR,
  });

  const history = useHistory();

  const { alertOpen, closeAlert, openAlert } = useAlert();

  const onPasswordChange = useCallback(
    (e) => {
      if (error.password.status) {
        setError({ ...error, password: DEFAULT_ERROR });
        setPassword(e.target.value.trim());
      } else {
        setPassword(e.target.value.trim());
      }
    },
    [error]
  );

  const onEmailChange = useCallback(
    (e) => {
      if (error.email) {
        setError({ ...error, email: DEFAULT_ERROR });
        setEmail(e.target.value.trim());
      } else {
        setEmail(e.target.value.trim());
      }
    },
    [error]
  );

  const signInWithEmailPassword = useCallback(() => {
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

        openAlert(5000);
      });
  }, [email, password, error, openAlert]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      signInWithEmailPassword();
    },
    [signInWithEmailPassword]
  );

  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        if (isSignedIn) {
          history.push("/overview/");
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
