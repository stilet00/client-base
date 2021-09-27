import React from "react";
import "./SmallLoader.css";
function SmallLoader(props) {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default SmallLoader;
