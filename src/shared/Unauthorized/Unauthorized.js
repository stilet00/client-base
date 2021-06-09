import React from "react";
import "./Unauthorized.css";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
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
function Unauthorized(props) {
  return (
    <>
      <div className={"unauthorized"}>
        <h1>You should enter a password...</h1>
      </div>
      <StyledButton>
        <Link to={"/"}>Back</Link>
      </StyledButton>
    </>
  );
}

export default Unauthorized;
