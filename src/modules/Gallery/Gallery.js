import React, { useState } from "react";
import "./Gallery.css";
import { CLIENTS } from "../../database/database";
import GalleryItem from "./GalleryItem/GalleryItem";
import DiscreteSlider from "../../shared/Slider/Slider";
import { useParams } from "react-router-dom";
import Unauthorized from "../../shared/Unauthorized/Unauthorized";
function Gallery(props) {
  const [ageFilter, setAgeFilter] = useState(18);
  const { status } = useParams();

  const page =
    status === "true" ? (
      <div className={"main-gallery-container"}>
        <div className="control-gallery">
          <DiscreteSlider valuetext={valuetext} />
        </div>
        <div className={"inner-gallery-container"}>
          {CLIENTS.filter((item) => item.age >= ageFilter).length > 0 ? (
            CLIENTS.filter((item) => item.age >= ageFilter).map((lady) => (
              <GalleryItem lady={lady} />
            ))
          ) : (
            <div className="empty">
              <h1 className>No matches</h1>
            </div>
          )}
        </div>
      </div>
    ) : (
      <Unauthorized />
    );
  function valuetext(value) {
    setAgeFilter(value);
  }
  return <>{page}</>;
}

export default Gallery;
