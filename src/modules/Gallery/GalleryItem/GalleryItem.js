import React from "react";
import "./GalleryItem.css";
import onlyIcon from "../../../images/onlyfans-icon.png";
import instaIcon from "../../../images/instagram-icon.png";
import moment from "moment"
function GalleryItem({ lady }) {
  const fans = lady.onlyFans ? (
    <a href={lady.onlyFans} target={"_blank"} rel="noreferrer">
      <img src={onlyIcon} width={"15px"} height={"15px"} alt={"onlyfans"}></img>
    </a>
  ) : null;
  const insta = lady.instagram ? (
    <a href={lady.instagram} target={"_blank"} rel="noreferrer">
      <img
        src={instaIcon}
        width={"15px"}
        height={"15px"}
        alt={"instagram"}
      ></img>
    </a>
  ) : null;
  return (
    <div className={"gallery-item"}>
      <p>{lady.name}</p>
      <p>{`${moment().diff(lady.age, 'years')} years`}</p>
      <img src={lady.image} alt="" className="lady-thumbnail" width={"100px"} />
      <div className="socials gallery-socials">
        {insta}
        {fans}
      </div>
    </div>
  );
}

export default GalleryItem;
