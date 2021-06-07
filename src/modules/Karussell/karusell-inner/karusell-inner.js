import React from 'react';
import "./karussell-inner.css"
import { CSSTransition, SwitchTransition } from "react-transition-group";
import instaIcon from "../../../images/instagram-icon.png"
import onlyIcon from "../../../images/onlyfans-icon.png"
function KarusellInner ({ data, animation }) {
    const fans = data.onlyFans ? (<a href={data.onlyFans} target={"_blank"} rel="noreferrer" >
        <img src={onlyIcon} width={"20px"} height={"20px"} alt={"onlyfans"}></img>
    </a>) : null
    const insta = data.instagram ? (<a href={data.instagram} target={"_blank"} rel="noreferrer" >
        <img src={instaIcon} width={"20px"} height={"20px"} alt={"instagram"}></img>
    </a>) : null
    return (
        <SwitchTransition mode={"out-in"}>
        <CSSTransition
            key={data.image}
            timeout={300}
            classNames={animation}
            unmountOnExit
        >
            <div className="karussell">
                <h3>{data.name}</h3>
                <img src={data.image} alt="lady" className={"main-photo"}/>
                    <div className="socials">
                        {insta}
                        {fans}
                    </div>
            </div>
        </CSSTransition>
        </SwitchTransition>
    );
}

export default KarusellInner;