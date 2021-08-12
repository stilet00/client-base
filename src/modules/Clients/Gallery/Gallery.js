import React, { useState } from "react";
import "./Gallery.css";
import { CLIENTS } from "../../../database/database";
import GalleryItem from "./GalleryItem/GalleryItem";
import DiscreteSlider from "../../../shared/Slider/Slider";
import Unauthorized from "../../../shared/Unauthorized/Unauthorized";
import moment from "moment";
import Header from "../../../shared/Header/Header";
import NameFilter from "../../../shared/NameFilter/NameFilter";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import ClientsForm from "../ClientsForm/ClientsForm";
function Gallery(props) {
  const [ageFilter, setAgeFilter] = useState(18);
  const [nameFilter, setNameFilter] = useState("");

  function valuetext(value) {
    setAgeFilter(value);
  }
  function onNameFilter(text) {
    setNameFilter(text);
  }
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return isSignedIn ? (
          <div className={"main-gallery-container"}>
            <div className="control-gallery">
              <Header pretty={{ borderBottom: "1px solid #50C878" }} />
              <ClientsForm />
              <DiscreteSlider valuetext={valuetext} />
              <NameFilter onChange={onNameFilter} nameFilter={nameFilter} />
            </div>
            <div className={"inner-gallery-container"}>
              <h3>List of clients:</h3>
              {CLIENTS.filter(
                (item) =>
                  moment().diff(item.age, "years") >= ageFilter &&
                  item.name.toLowerCase().includes(nameFilter.toLowerCase())
              ).length > 0 ? (
                CLIENTS.filter(
                  (item) =>
                    moment().diff(item.age, "years") >= ageFilter &&
                    item.name.toLowerCase().includes(nameFilter.toLowerCase())
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
      }}
    </FirebaseAuthConsumer>
  );
}

export default Gallery;
