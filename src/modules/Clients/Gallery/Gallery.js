import React, { useCallback, useState } from "react";
import "../../../styles/modules/Gallery.css";
import { CLIENTS } from "../../../database/database";
import GalleryItem from "./GalleryItem/GalleryItem";
import DiscreteSlider from "../../../sharedComponents/Slider/Slider";
import Unauthorized from "../../../sharedComponents/Unauthorized/Unauthorized";
import moment from "moment";
import Header from "../../../sharedComponents/Header/Header";
import NameFilter from "../../../sharedComponents/NameFilter/NameFilter";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import ClientsForm from "../ClientsForm/ClientsForm";
function Gallery() {
  const [ageFilter, setAgeFilter] = useState(18);
  const [nameFilter, setNameFilter] = useState("");
  const valueText = useCallback((value) => {
    setAgeFilter(value);
  }, []);
  const onNameFilter = useCallback((text) => {
    setNameFilter(text);
  }, []);
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return isSignedIn ? (
          <div className={"gallery-container"}>
            <div className="gallery-menu">
              <Header />
              <ClientsForm />
              <DiscreteSlider valuetext={valueText} />
              <NameFilter onChange={onNameFilter} nameFilter={nameFilter} />
            </div>
            <div className={"inner-gallery-container"}>
              <h3 className={"clients-header"}>List of clients:</h3>
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
