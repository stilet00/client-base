import React from "react";
import "./Unauthorized.css";
import { Link } from "react-router-dom";
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
function Unauthorized(props) {
  return (
    <>
      <div className={"unauthorized"}>
        <h1>You should log in before using this service...</h1>
      </div>
      <StyledButton>
        <Link to={"/"}>Back</Link>
      </StyledButton>
    </>
  );
}

export default Unauthorized;
