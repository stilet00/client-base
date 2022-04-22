import { useCallback, useState } from "react";
import { CLIENTS } from "../../database/database";
import {
  currentMonth,
  currentYear,
  DEFAULT_CLIENT,
} from "../../constants/constants";
import useModal from "../../sharedHooks/useModal";
import { calculateBalanceDaySum } from "../../sharedFunctions/sharedFunctions";

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

export const useClientsList = (translators) => {
  function clientMonthSum(clientId, monthNumber = currentMonth) {
    let totalClientBalance = 0;

    translators.forEach((translator) => {
      const thisYearStat = translator.statistics.find(
        (year) => year.year === currentYear
      );

      const thisMonthStat = thisYearStat.months[monthNumber - 1];

      thisMonthStat.forEach((day) => {
        const clientBalanceDay = day.clients.find(
          (client) => client.id === clientId
        );
        if (clientBalanceDay) {
          totalClientBalance =
            totalClientBalance + calculateBalanceDaySum(clientBalanceDay);
        }
      });
    });

    return Math.round(totalClientBalance);
  }

  function sortBySum(clientOne, clientTwo) {
    return clientMonthSum(clientOne._id) < clientMonthSum(clientTwo._id) ? 1 : -1
  }

  function calculateRating(clientId) {
    const clientSum = clientMonthSum(clientId);

    return clientSum > 3000 ? 5 : clientSum > 2000 ? 4 : clientSum > 1000 ? 3 : clientSum > 500 ? 2 : 1
  }

  return {
    clientMonthSum,
    sortBySum,
    calculateRating
  };
};
