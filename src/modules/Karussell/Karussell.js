import React, { useState } from "react";
import "./karusell.css";
import { CLIENTS } from "../../database/database";
import KarusellInner from "./karusell-inner/karusell-inner";
import logo from "../../images/logo.png";
import arrow from "../../images/arrow.png";
function Karussell(props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  function goNext() {
    setAnimationClass("forward");
    CLIENTS.length - 1 !== currentStep
      ? setCurrentStep(currentStep + 1)
      : setCurrentStep(0);
  }
  function goPrevious() {
    setAnimationClass("back");
    currentStep === 0
      ? setCurrentStep(CLIENTS.length - 1)
      : setCurrentStep(currentStep - 1);
  }
  return (
    <div className={"karussell-container"}>
      <KarusellInner data={CLIENTS[currentStep]} animation={animationClass} />
      <button className={"control previous"} onClick={goPrevious}>
        <img src={arrow} width={"20px"} height={"20px"} alt={"previous"} />
      </button>
      <button className={"control next"} onClick={goNext}>
        <img
          src={arrow}
          width={"20px"}
          height={"20px"}
          className={"rotated-icon"}
          alt={"next"}
        />
      </button>
    </div>
  );
}

export default Karussell;
