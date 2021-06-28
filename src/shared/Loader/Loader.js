import React from "react";
import "./Loader.css";
function Loader({ position }) {
  return (
    <div className="lds-facebook" style={{ top: position }}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Loader;
