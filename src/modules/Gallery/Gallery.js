import React, { useState } from 'react';
import "./Gallery.css"
import { CLIENTS } from "../../database/database";
import GalleryItem from "./GalleryItem/GalleryItem";
import DiscreteSlider from "../../shared/Slider/Slider";
function Gallery (props) {
    const [ageFilter, setAgeFilter] = useState(18)
    function valuetext(value) {
        setAgeFilter(value);
    }
    return (
        <div className={"main-gallery-container"}>
            <div className="control-gallery">
                <DiscreteSlider valuetext={valuetext}/>
            </div>
        <div className={"inner-gallery-container"}>
            {CLIENTS.filter(item => item.age >= ageFilter).map(lady => <GalleryItem lady={lady} />)}
        </div>
        </div>
    );
}

export default Gallery;