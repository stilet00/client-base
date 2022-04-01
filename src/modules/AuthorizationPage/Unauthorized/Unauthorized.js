import React, { useState, useEffect } from "react";
import "../../../styles/modules/Unauthorized.css";
import { Link, useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const StyledButton = withStyles({
  root: {
    borderRadius: 3,
    border: 0,
    height: 48,
    padding: "0 30px",
    boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    letterSpacing: "3px",
    fontWeight: "bold",
    background: "black",
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

  useEffect(() => {
    const timeCount = setTimeout(reduceTime, 1000);
    return () => {
      // cancel the subscription
      clearTimeout(timeCount);
    };
  });

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
