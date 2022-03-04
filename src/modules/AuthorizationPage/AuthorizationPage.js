import "../../styles/modules/AuthorizationPage.css";
import { Button, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import {useAuthorizationPage} from "./businessLogic";

const StyledButton = withStyles({
  root: {
    borderRadius: 3,
    border: "1px solid black",
    color: "black",
    height: 48,
    padding: "0 30px",
    background: "rgba(255,255,255,0.5)",
    boxShadow: "none",
    letterSpacing: "3px",
    fontWeight: "bold",
    backdropFilter: "blur(10px)",
    "&:hover": {
      background: "rgba(78, 205, 196, 1)",
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
      background: "rgba(255, 255, 255, 0.5)",
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
  const { history,
          onPasswordChange,
          alertOpen,
          closeAlert,
          email,
          error,
          onEmailChange,
          onSubmit,
          openAlert,
          password } = useAuthorizationPage();

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
