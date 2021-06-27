import React, { useState } from "react";
import "./Gallery.css";
import { CLIENTS } from "../../database/database";
import GalleryItem from "./GalleryItem/GalleryItem";
import DiscreteSlider from "../../shared/Slider/Slider";
import { useParams } from "react-router-dom";
import Unauthorized from "../../shared/Unauthorized/Unauthorized";
import moment from "moment";
import Header from "../../shared/Header/Header";
function Gallery(props) {
  const [ageFilter, setAgeFilter] = useState(18);
  const { status } = useParams();

  const page =
    status === "true" ? (
      <div className={"main-gallery-container"}>
        <div className="control-gallery">
          <Header pretty={{ borderBottom: "1px solid #50C878" }} />
          <DiscreteSlider valuetext={valuetext} />
        </div>
        <div className={"inner-gallery-container"}>
          {CLIENTS.filter(
            (item) => moment().diff(item.age, "years") >= ageFilter
          ).length > 0 ? (
            CLIENTS.filter(
              (item) => moment().diff(item.age, "years") >= ageFilter
            ).map((lady) => <GalleryItem lady={lady} key={lady.id} />)
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
