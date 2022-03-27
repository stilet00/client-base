import { useCallback, useEffect, useState } from "react";
import { MESSAGES } from "../../constants/messages";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";
import {
  addTranslator,
  getTranslators,
  removeTranslator,
  updateTranslator,
} from "../../services/translatorsServices/services";
import {
  DEFAULT_DAY_CLIENT,
} from "../../constants/constants";

import {
  addClient,
  getClients,
  removeClient,
} from "../../services/clientsServices/services";
import { useAlertConfirmation } from "../../sharedComponents/AlertMessageConfirmation/hooks";
import moment from "moment";

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
  }, []);

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
    (editedTranslator) => {
      updateTranslator(editedTranslator).then((res) => {
        if (res.status === 200) {
          showAlertMessage(MESSAGES.translatorFilled);
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
    [translators]
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
        saveChangedTranslator(editedTranslator);
      }
    },
    [translators, currentClient, showAlertMessage]
  );

  const insertClient = useCallback((translator, client) => {
    const clientBalanceDay = new DEFAULT_DAY_CLIENT(client._id);
    const updatedStatistics = translator.statistics.map((item) => {
      if (item.year === moment().format("YYYY")) {
        const updatedMonths = item.months.map((month, index) => {
          if (index + 1 >= Number(moment().format("M"))) {
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

  const onTranslatorDelete = useCallback(
    (id) => {
      console.log(translators.find((item) => item._id === id));
      removeTranslator(id).then((res) => {
        if (res.status === 200) {
          showAlertMessage(MESSAGES.translatorDeleted);
          setTranslators(translators.filter((item) => item._id !== id));
        } else {
          showAlertMessage(MESSAGES.somethingWrong);
          console.log(res.data);
        }
      });
    },
    [translators, showAlertMessage]
  );

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
            console.log(res.data);
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

  const balanceDaySubmit = (translatorId, balanceDay, clientId) => {
    let editedTranslator = translators.find(
      (item) => item._id === translatorId
    );

    let editedClient = editedTranslator.clients.find(
      (item) => item._id === clientId
    );

    editedClient.balanceByYears = editedClient.balanceByYears.map((year) => {
      const editedListOfMonths = year.months.map((month) => {
        const monthEdited = month.map((day) => {
          return day.id === balanceDay.id ? balanceDay : day;
        });

        return monthEdited;
      });

      return { ...year, months: editedListOfMonths };
    });

    editedTranslator.clients = editedTranslator.clients.map((client) => {
      return client._id === editedClient._id ? editedClient : client;
    });

    saveChangedTranslator(editedTranslator);
  };

  return {
    translators,
    onTranslatorDelete,
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
  };
};
