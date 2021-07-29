import React, { useState } from "react";
import "./karusell.css";
import { CLIENTS } from "../../database/database";
import KarusellInner from "./karusell-inner/karusell-inner";
import arrow from "../../images/arrow.png";
import Header from "../../shared/Header/Header";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import Unauthorized from "../../shared/Unauthorized/Unauthorized";
function Karussell(props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const [imageLoaded, setImageLoaded] = useState("none");
  function goNext() {
    setImageLoaded("none");
    setAnimationClass("forward");
    CLIENTS.length - 1 !== currentStep
      ? setCurrentStep(currentStep + 1)
      : setCurrentStep(0);
  }
  function goPrevious() {
    setImageLoaded("none");
    setAnimationClass("back");
    currentStep === 0
      ? setCurrentStep(CLIENTS.length - 1)
      : setCurrentStep(currentStep - 1);
  }
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return isSignedIn ? (
          <div className={"karussell-container"}>
            <Header />
            <KarusellInner
              data={CLIENTS[currentStep]}
              animation={animationClass}
              imageLoaded={imageLoaded}
              setImageLoaded={setImageLoaded}
            />
            <button className={"control previous"} onClick={goPrevious}>
              <img
                src={arrow}
                width={"20px"}
                height={"20px"}
                alt={"previous"}
              />
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
        ) : (
          <Unauthorized />
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default Karussell;
