import React from 'react';
import "./GalleryItem.css";
function GalleryItem ({lady}) {
    return (
        <div className={"gallery-item"}>
            <p>{lady.name}</p>
            <p>{`${lady.age} years`}</p>
            <img src={lady.image} alt="" className="lady-thumbnail" width={"100px"}/>
        </div>
    );
}

export default GalleryItem;