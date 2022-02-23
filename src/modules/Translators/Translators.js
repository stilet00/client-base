import React, { useCallback, useEffect, useState } from "react";
import Header from "../../sharedComponents/Header/Header";
import Unauthorized from "../../sharedComponents/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  addClient,
  getClients,
  removeClient,
} from "../../services/clientsServices/services";
import PersonIcon from "@material-ui/icons/Person";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import TranslatorsForm from "./TranslatorsForm/TranslatorsForm";
import {
  addTranslator,
  getTranslators,
  removeTranslator,
  updateTranslator,
} from "../../services/translatorsServices/services";
import SingleTranslator from "./SingleTranslator/SingleTranslator";
import "../../styles/modules/Translators.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ClientsForm from "../Clients/ClientsForm/ClientsForm";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";
import Loader from "../../sharedComponents/Loader/Loader";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { MESSAGES } from "../../constants/messages";

function Translators() {
  const [message, setMessage] = useState(MESSAGES.addTranslator);

  const [clients, setClients] = useState([]);

  const [translators, setTranslators] = useState([]);

  const [currentClient, setCurrentClient] = useState(null);

  const [state, setState] = useState({
    left: false,
  });

  const [loading, setLoading] = useState(false);

  const { alertOpen, closeAlert, openAlert } = useAlert();

  useEffect(() => {
    setLoading(true);

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
        console.log(res.data);
      } else {
        console.log("No clients");
      }
    });
  }, []);

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
    e.target.style.border = "2px solid orange";
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
      e.target.style.background = "rgba(200, 247, 197, 1)";
    } else if (e.target.tagName === "LI") {
      e.target.parentNode.style.background = "rgba(200, 247, 197, 1)";
    }
  }, []);

  const dragDropHandler = useCallback((e, task, board) => {
    e.preventDefault();
    e.target.style.background = "none";
  }, []);

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
        editedTranslator = {
          ...editedTranslator,
          clients: [...editedTranslator.clients, currentClient],
        };
        updateTranslator(editedTranslator).then((res) => {
          if (res.status === 200) {
            showAlertMessage(MESSAGES.translatorFilled);
            setTranslators(
              translators.map((item) => {
                return item._id === translatorID ? editedTranslator : item;
              })
            );
          } else {
            showAlertMessage(MESSAGES.somethingWrong);
            console.log(res.data);
          }
        });
      }
    },
    [translators, currentClient, openAlert, closeAlert]
  );

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
    [clients]
  );

  const onTranslatorDelete = useCallback(
    (id) => {
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
    [translators]
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
    [translators]
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
    [clients]
  );

  function showAlertMessage(alertMessage) {
    setMessage(alertMessage);
    openAlert();
  }

  const page =
    translators.length > 0 ? (
      translators.map((item) => (
        <SingleTranslator
          deleteTranslator={onTranslatorDelete}
          {...item}
          key={item._id}
          dragOverHandler={dragOverHandler}
          onBoardDrop={onBoardDrop}
          dragLeaveHandler={dragLeaveHandler}
        />
      ))
    ) : (
      <div className="empty">
        {loading ? <Loader /> : <h1>No translators yet.</h1>}
      </div>
    );
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return isSignedIn ? (
          <div className={"gallery-container"}>
            <div className="gallery-menu">
              <Header pretty={{ borderBottom: "1px solid #50C878" }} />
              <div className={"socials button-add-container middle-button"}>
                <ListAltIcon />
                <Button onClick={toggleDrawer("left", true)} fullWidth>
                  Show clients
                </Button>
                <Drawer
                  anchor={"left"}
                  open={state["left"]}
                  onClose={toggleDrawer("left", false)}
                >
                  <div className={"side-clients-menu fallDown-menu"}>
                    <h3>All clients:</h3>
                    <ul>
                      {clients.map((client, index) => (
                        <li
                          key={client._id}
                          className={"left-menu-item"}
                          draggable={true}
                          onDragStart={(e) => dragStartHandler(e, client)}
                          onDragOver={dragOverHandler}
                          onDragLeave={dragLeaveHandler}
                          onDragEnd={dragEndHandler}
                          onDrop={(e) => dragDropHandler(e)}
                        >
                          <ListItemIcon>
                            {index % 2 === 0 ? (
                              <PersonIcon />
                            ) : (
                              <PersonOutlineIcon />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={`${client.name} ${client.surname}`}
                          />
                          <Button onClick={() => deleteClient(client._id)}>
                            <DeleteForeverIcon />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Drawer>
              </div>
              <ClientsForm onFormSubmit={clientsFormSubmit} />
              <TranslatorsForm onFormSubmit={translatorsFormSubmit} />
            </div>
            <div className={"inner-gallery-container  translators-container"}>
              <h3>List of translators:</h3>
              {page}
            </div>
            <AlertMessage
              mainText={message.text}
              open={alertOpen}
              handleOpen={openAlert}
              handleClose={closeAlert}
              status={message.status}
            />
          </div>
        ) : (
          <Unauthorized />
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default Translators;
