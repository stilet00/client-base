import React, { useState } from 'react';
import "./karusell.css"
import { CLIENTS } from "../../database/database";
import arrow from "../../images/arrow.png"
import KarusellInner from "./karusell-inner/karusell-inner";
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import logo from "../../images/logo.png";
function Karussell (props) {

    const [currentStep, setCurrentStep] = useState(0)
    const [animationClass, setAnimationClass] = useState('')
    function goNext() {
        setAnimationClass('forward')
        CLIENTS.length-1 !== currentStep ? setCurrentStep(currentStep + 1) : setCurrentStep(0)
    }
    function goPrevious() {
        setAnimationClass('back')
        currentStep === 0 ? setCurrentStep(CLIENTS.length-1) : setCurrentStep(currentStep - 1)
    }
    return (
        <div className={"karussell-container"}>
            <h2>Sunrise  <img src={logo} className="App-logo" alt="logo" /> models</h2>
            <KarusellInner
                data={CLIENTS[currentStep]}
                animation={animationClass}
            />
                <button className={"control previous"} onClick={goPrevious}>
                    {/*<ArrowBackIcon />*/}
                    <img src={arrow} width={"20px"} height={"20px"} alt={"previous"}/>
                </button>
                <button className={"control next"} onClick={goNext}>
                    {/*<ArrowForwardIcon />*/}
                    <img src={arrow} width={"20px"} height={"20px"} className={"rotated-icon"} alt={"next"}/>
                </button>
        </div>
    );
}

export default Karussell;