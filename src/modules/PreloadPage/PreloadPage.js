import React from "react";
import "../../styles/modules/PreloadPage.css";
import Loader from "../../sharedComponents/Loader/Loader";

function PreloadPage({ isLoaded }) {
  return (
    <div className={isLoaded ? "preload-page" : "preload-page invisible"}>
      <Loader position={"0"} />
    </div>
  );
}

export default PreloadPage;
