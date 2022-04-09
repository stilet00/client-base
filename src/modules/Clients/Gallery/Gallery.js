import "../../../styles/modules/Gallery.css";
import { CLIENTS } from "../../../database/database";
import GalleryItem from "./GalleryItem/GalleryItem";
import DiscreteSlider from "../../../sharedComponents/Slider/Slider";
import Unauthorized from "../../AuthorizationPage/Unauthorized/Unauthorized";
import moment from "moment";
import Menu from "../../../sharedComponents/Navigation/Navigation";
import NameFilter from "../../../sharedComponents/NameFilter/NameFilter";
import ClientsForm from "../ClientsForm/ClientsForm";
import { useGallery } from "../businessLogic";

function Gallery({ user }) {
  const { valueText, ageFilter, nameFilter, onNameFilter } = useGallery(user);

  return user ? (
    <div className={"gallery-container"}>
      <div className="gallery-menu">
        <Menu />
        <ClientsForm />
        <DiscreteSlider valuetext={valueText} />
        <NameFilter onChange={onNameFilter} nameFilter={nameFilter} />
      </div>
      <div className={"inner-gallery-container animated-box"}>
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
}

export default Gallery;
