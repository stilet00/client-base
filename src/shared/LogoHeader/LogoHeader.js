import React from "react";
import logo from "../../images/logo.png";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import "./LogoHeader.css";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import ColoredButton from "../ColoredButton/ColoredButton";
function LogoHeader(props) {
  const history = useHistory();
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return (
          <div className="App-header">
            <h2 className={"sunrise-header"}>
              Sunrise <img src={logo} className="App-logo" alt="logo" /> models
            </h2>
            {isSignedIn ? (
              <>
                <p className={"logged-user"}>
                  Welcome,
                  <span className={"user-email"}>
                    {isSignedIn ? ` ${user.email}` : null}{" "}
                  </span>
                </p>
              </>
            ) : null}
          </div>
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default LogoHeader;
