import React from "react";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import "../../styles/sharedComponents/WelcomeMessage.css";
import Button from "@material-ui/core/Button";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function WelcomeMessage() {
  const history = useHistory();

  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return (
          <div className="App-header">
            {isSignedIn ? (
              <>
                <p className={"logged-user"}>
                  Welcome,
                  <span className={"user-email"}>
                    {isSignedIn ? ` ${user.email}` : null}{" "}
                  </span>
                  <Button
                    variant="outlined"
                    className={"logout_button-hover"}
                    onClick={() => {
                      firebase.auth().signOut();
                      setTimeout(() => {
                        history.push("/");
                      }, 1000);
                    }}
                  >
                    <ExitToAppIcon />
                  </Button>
                </p>
              </>
            ) : null}
          </div>
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default WelcomeMessage;
