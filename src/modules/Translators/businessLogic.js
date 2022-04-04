import { useCallback, useEffect, useState } from "react";
import { MESSAGES } from "../../constants/messages";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";
import {
  addTranslator,
  getTranslators,
  removeTranslator,
  updateTranslator,
} from "../../services/translatorsServices/services";
import { currentMonth, currentYear, DEFAULT_DAY_CLIENT } from "../../constants/constants";

import {
  addClient,
  getClients,
  removeClient,
} from "../../services/clientsServices/services";
import { useAlertConfirmation } from "../../sharedComponents/AlertMessageConfirmation/hooks";
import moment from "moment";
import useModal from "../../sharedHooks/useModal";
import {
  calculateBalanceDayAllClients,
  calculateBalanceDaySum, calculateTranslatorMonthTotal,
  findYesterday,
} from "../../sharedFunctions/sharedFunctions";

export const useTranslators = (user) => {
  const [message, setMessage] = useState(MESSAGES.addTranslator);

  const [clients, setClients] = useState([]);

  const [translators, setTranslators] = useState([]);

  const [currentClient, setCurrentClient] = useState(null);

  const [state, setState] = useState({
    left: false,
  });

  const [loading, setLoading] = useState(false);

  const { alertOpen, closeAlert, openAlert } = useAlert();

  const [deletedTranslator, setDeletedTranslator] = useState(null);

  const {
    alertStatusConfirmation,
    openAlertConfirmation,
    closeAlertConfirmationNoReload,
  } = useAlertConfirmation();

  useEffect(() => {
    setLoading(true);

    if (user) {
      getTranslators().then((res) => {
        if (res.status === 200) {
          setLoading(false);
          setTranslators(res.data);
        } else {
          console.log("No translators");
        }
      });

      getClients().then((res) => {
        if (res.status === 200) {
          setClients(res.data);
        } else {
          console.log("No clients");
        }
      });
    }
  }, [user]);

  const showAlertMessage = useCallback(
    (alertMessage) => {
      setMessage(alertMessage);
      openAlert();
    },
    [openAlert]
  );

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const dragStartHandler = useCallback((e, client) => {
    setCurrentClient(client);
    e.target.style.border = "2px solid red";
  }, []);

  const dragLeaveHandler = useCallback(
    (e) => {
      if (state.left === true) {
        setState({ left: false });
      }
      if (e.target.tagName === "UL") {
        e.target.style.background = "none";
      } else if (e.target.tagName === "LI") {
        e.target.parentNode.style.background = "none";
      }
    },
    [state]
  );

  const dragEndHandler = useCallback((e) => {
    e.target.style.background = "none";
  }, []);

  const dragOverHandler = useCallback((e) => {
    e.preventDefault();
    if (e.target.tagName === "UL") {
      e.target.style.background = "rgba(255,255,255, 0.5)";
    } else if (e.target.tagName === "LI") {
      e.target.parentNode.style.background = "rgba(255,255,255, 0.5)";
    }
  }, []);

  const dragDropHandler = useCallback((e, task, board) => {
    e.preventDefault();
    e.target.style.background = "none";
  }, []);

  const saveChangedTranslator = useCallback(
    (editedTranslator, message) => {
      updateTranslator(editedTranslator).then((res) => {
        if (res.status === 200) {
          showAlertMessage(message);
          setTranslators(
            translators.map((item) => {
              return item._id === editedTranslator._id
                ? editedTranslator
                : item;
            })
          );
        } else {
          showAlertMessage(MESSAGES.somethingWrong);
          console.log(res.data);
        }
      });
    },
    [translators, showAlertMessage]
  );

  const onBoardDrop = useCallback(
    (e, translatorID) => {
      e.preventDefault();
      if (e.target.tagName === "UL") {
        e.target.style.background = "none";
      } else if (e.target.tagName === "LI") {
        e.target.parentNode.style.background = "none";
      }

      let editedTranslator = translators.find(
        (item) => item._id === translatorID
      );

      if (
        editedTranslator.clients.filter(
          (item) => item._id === currentClient._id
        ).length > 0
      ) {
        showAlertMessage(MESSAGES.clientExist);
      } else {
        editedTranslator = insertClient(editedTranslator, currentClient);
        saveChangedTranslator(editedTranslator, MESSAGES.translatorFilled);
      }
    },
    [translators, currentClient, showAlertMessage, showAlertMessage]
  );

  const insertClient = useCallback((translator, client) => {
    const clientBalanceDay = new DEFAULT_DAY_CLIENT(client._id);
    const updatedStatistics = translator.statistics.map((item) => {
      if (item.year === currentYear) {
        const updatedMonths = item.months.map((month, index) => {
          if (index + 1 >= Number(currentMonth )) {
            return month.map((day) => {
              return { ...day, clients: [...day.clients, clientBalanceDay] };
            });
          } else {
            return month;
          }
        });
        return { ...item, months: updatedMonths };
      } else {
        return item;
      }
    });

    translator = {
      ...translator,
      statistics: updatedStatistics,
      clients: [...translator.clients, client],
    };

    return translator;
  }, []);

  const deleteClient = useCallback(
    (id) => {
      removeClient(id).then((res) => {
        if (res.status === 200) {
          showAlertMessage(MESSAGES.clientDeleted);
          setClients(clients.filter((item) => item._id !== id));
        } else {
          showAlertMessage(MESSAGES.somethingWrong);
          console.log(res.data);
        }
      });
    },
    [clients, showAlertMessage]
  );

  const startTranslatorDelete = useCallback(
    (id) => {
      const translator = translators.find((item) => item._id === id);

      setDeletedTranslator(translator);

      setMessage({
        text: `You are deleting ${translator.name} ${translator.surname}`,
        status: false,
      });

      openAlertConfirmation();
    },
    [translators, openAlertConfirmation]
  );

  const finishTranslatorDelete = useCallback(() => {
    removeTranslator(deletedTranslator._id).then((res) => {
      if (res.status === 200) {
        closeAlertConfirmationNoReload();
        setTranslators(
          translators.filter((item) => item._id !== deletedTranslator._id)
        );
        setMessage(MESSAGES.addTranslator);
      } else {
        showAlertMessage(MESSAGES.somethingWrong);
        console.log(res.data);
      }
    });
  }, [
    translators,
    showAlertMessage,
    closeAlertConfirmationNoReload,
    deletedTranslator,
  ]);

  const translatorsFormSubmit = useCallback(
    (e, newTranslator) => {
      e.preventDefault();
      if (
        translators.filter((existingTranslator) => {
          return (
            existingTranslator.name.toLowerCase() ===
              newTranslator.name.toLowerCase() &&
            existingTranslator.surname.toLowerCase() ===
              newTranslator.surname.toLowerCase()
          );
        }).length
      ) {
        showAlertMessage(MESSAGES.translatorExist);
      } else {
        showAlertMessage(MESSAGES.addTranslator);
        addTranslator(newTranslator).then((res) => {
          if (res.status === 200) {
            setTranslators([
              ...translators,
              { ...newTranslator, _id: res.data },
            ]);
          } else {
            console.log(res.status);
          }
        });
      }
    },
    [translators, showAlertMessage]
  );

  const clientsFormSubmit = useCallback(
    (e, newClient) => {
      e.preventDefault();

      addClient(newClient).then((res) => {
        if (res.status === 200) {
          showAlertMessage(MESSAGES.addClient);
          setClients([...clients, { ...newClient, _id: res.data }]);
        } else {
          showAlertMessage(MESSAGES.somethingWrong);
          console.log(res.data);
        }
      });
    },
    [clients, showAlertMessage]
  );

  const balanceDaySubmit = (translatorId, balanceDay) => {
    let editedTranslator = translators.find(
      (item) => item._id === translatorId
    );
    const newStatistics = editedTranslator.statistics.map((year) => {
      const newMonths = year.months.map((month) => {
        return month.map((day) => {
          return day.id === balanceDay.id ? balanceDay : day;
        });
      });
      return { ...year, months: newMonths };
    });

    editedTranslator.statistics = newStatistics;
    saveChangedTranslator(editedTranslator, MESSAGES.changesSaved);
  };

  const calculateTotalBalanceDay = useCallback(() => {
    let sum = 0;
    translators.forEach((translator) => {
      let translatorsStatistic = translator.statistics;
      sum = sum + Number(calculateTranslatorMonthTotal(translatorsStatistic));
    });
    return Math.round(sum);
  }, [translators]);

  const calculateTranslatorYesterdayTotal = (statistics, filter) => {
    const day = statistics
      .find((year) => year.year === currentYear)
      .months.find((month, index) => index + 1 === Number(currentMonth ))
      .find((day) => {
        return (
          day.id === moment().subtract(1, "day").format("DD MM YYYY") ||
          day.id === moment().format("DD MM YYYY")
        );
      });
    return calculateBalanceDayAllClients(day);
  };


  return {
    translators,
    startTranslatorDelete,
    dragOverHandler,
    onBoardDrop,
    dragLeaveHandler,
    loading,
    toggleDrawer,
    state,
    clients,
    dragEndHandler,
    dragStartHandler,
    dragDropHandler,
    deleteClient,
    clientsFormSubmit,
    translatorsFormSubmit,
    message,
    alertOpen,
    openAlert,
    closeAlert,
    balanceDaySubmit,
    alertStatusConfirmation,
    openAlertConfirmation,
    closeAlertConfirmationNoReload,
    finishTranslatorDelete,
    calculateTranslatorMonthTotal,
    calculateTranslatorYesterdayTotal,
    calculateTotalBalanceDay,
  };
};

export const useBalanceForm = ({ balanceDaySubmit, statistics, clients }) => {
  const { open, handleOpen, handleClose } = useModal();

  const [selectedClient, setSelectedClient] = useState(clients[0]._id);

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [selectedDay, setSelectedDay] = useState(findYesterday());

  const [currentBalanceDay, setCurrentBalanceDay] = useState(
    findTodayBalance()
  );

  useEffect(() => {
    setCurrentBalanceDay(findTodayBalance());
  }, [selectedYear, selectedMonth, selectedDay]);

  function findYear() {
    return statistics.find((item) => item.year === selectedYear);
  }

  function findMonth() {
    return findYear().months.find(
      (item, index) => index + 1 === Number(selectedMonth)
    );
  }

  function findTodayBalance() {
    return findMonth().find((item, index) => index + 1 === Number(selectedDay));
  }

  const handleYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonth = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleDay = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleClient = (e) => {
    setSelectedClient(e.target.value);
  };

  const handleChange = useCallback(
    (e) => {
      const editedClientsBalance = currentBalanceDay.clients.map((client) => {
        if (client.id === selectedClient) {
          return { ...client, [e.target.name]: Number(e.target.value) };
        } else {
          return client;
        }
      });

      setCurrentBalanceDay({
        ...currentBalanceDay,
        clients: editedClientsBalance,
      });
    },
    [selectedClient, currentBalanceDay]
  );

  function findClientById(id) {
    if (id) {
      return currentBalanceDay.clients.find((item) => item.id === id);
    } else {
      return currentBalanceDay.clients.find((item) => item.id === selectedClient);
    }
  }

  function onSavePressed() {
    balanceDaySubmit(currentBalanceDay);
  }

  return {
    handleOpen,
    open,
    handleClose,
    selectedYear,
    handleYear,
    selectedMonth,
    handleMonth,
    findYear,
    selectedDay,
    handleDay,
    findMonth,
    selectedClient,
    handleClient,
    handleChange,
    findClientById,
    onSavePressed,
    currentBalanceDay,
  };
};

export const useSingleTranslator = (statistics) => {
  function findYear() {
    return statistics.find((item) => item.year === currentYear);
  }

  function findMonth() {
    return findYear().months.find(
        (item, index) => index + 1 === Number(currentMonth));
  }

  function findTodayBalance() {
    return findMonth().find((item, index) => index + 1 === Number(findYesterday()));
  }

  function calculateSumByClient(clientId) {
    const clientObject = findTodayBalance().clients.find(item => item.id === clientId);
    return clientObject ? calculateBalanceDaySum(clientObject) : null
  }

  return {
    calculateSumByClient
  }
}