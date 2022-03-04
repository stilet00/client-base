import React, { useState } from "react";
import "../../../styles/modules/Unauthorized.css";
import { Link, useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

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

function Unauthorized() {
  const [time, setTime] = useState(3);

  const history = useHistory();

  function reduceTime() {
    if (time > 1) {
      setTime(time - 1);
    } else {
      history.push("/");
    }
  }

  setTimeout(reduceTime, 1000);

  return (
    <>
      <div className={"unauthorized"}>
        <h1>You should log in before using this service...</h1>
        <p>You will be redirected in ...{time}</p>
        <StyledButton>
          <Link to={"/"}>Back</Link>
        </StyledButton>
      </div>
    </>
  );
}

export default Unauthorized;
