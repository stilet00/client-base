import "../../../styles/modules/karusell.css";
import { CLIENTS } from "../../../database/database";
import KarusellInner from "./karusell-inner/karusell-inner";
import arrow from "../../../images/arrow.png";
import Menu from "../../../sharedComponents/Menu/Menu";
import Unauthorized from "../../AuthorizationPage/Unauthorized/Unauthorized";
import { useKarusell } from "../businessLogic";

function Karussell({ user }) {
  const {
    currentStep,
    animationClass,
    goNext,
    goPrevious,
    imageLoaded,
    setImageLoaded,
  } = useKarusell();

  return user ? (
    <div className={"karussell-container"}>
      <Menu />
      <KarusellInner
        data={CLIENTS[currentStep]}
        animation={animationClass}
        imageLoaded={imageLoaded}
        setImageLoaded={setImageLoaded}
      />
      <button className={"control previous"} onClick={goPrevious}>
        <img src={arrow} width={"20px"} height={"20px"} alt={"previous"} />
      </button>
      <button className={"control next"} onClick={goNext}>
        <img
          src={arrow}
          width={"20px"}
          height={"20px"}
          className={"rotated-icon"}
          alt={"next"}
        />
      </button>
    </div>
  ) : (
    <Unauthorized />
  );
}

export default Karussell;
