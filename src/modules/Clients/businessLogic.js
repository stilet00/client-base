import { useCallback, useState } from "react";
import { CLIENTS } from "../../database/database";
import { DEFAULT_CLIENT } from "../../constants/constants";
import useModal from "../../sharedHooks/useModal";

export const useKarusell = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [animationClass, setAnimationClass] = useState("");

  const [imageLoaded, setImageLoaded] = useState("none");

  function goNext() {
    setImageLoaded("none");
    setAnimationClass("forward");
    CLIENTS.length - 1 !== currentStep
      ? setCurrentStep(currentStep + 1)
      : setCurrentStep(0);
  }

  function goPrevious() {
    setImageLoaded("none");
    setAnimationClass("back");
    currentStep === 0
      ? setCurrentStep(CLIENTS.length - 1)
      : setCurrentStep(currentStep - 1);
  }

  return {
    currentStep,
    animationClass,
    imageLoaded,
    setImageLoaded,
    goPrevious,
    goNext,
  };
};

export const useGallery = () => {
  const [ageFilter, setAgeFilter] = useState(18);

  const [nameFilter, setNameFilter] = useState("");

  const valueText = useCallback((value) => {
    setAgeFilter(value);
  }, []);

  const onNameFilter = useCallback((text) => {
    setNameFilter(text);
  }, []);

  return {
    ageFilter,
    nameFilter,
    onNameFilter,
    valueText,
  };
};

export const useClientsForm = ({ onFormSubmit, editedClient }) => {
  const [client, setClient] = useState(editedClient || DEFAULT_CLIENT);

  const { handleClose, handleOpen, open } = useModal();

  const handleChange = useCallback(
    (e) => {
      setClient({ ...client, [e.target.name]: e.target.value.trim() });
    },
    [client]
  );

  function clearClient() {
    setClient(DEFAULT_CLIENT);
  }

  return {
    handleOpen,
    open,
    client,
    clearClient,
    handleClose,
    onFormSubmit,
    handleChange,
  };
};
