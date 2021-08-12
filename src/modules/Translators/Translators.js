import React, { useEffect, useState } from "react";
import Header from "../../shared/Header/Header";
import Unauthorized from "../../shared/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  getClients,
  removeClient,
} from "../../services/clientsServices/services";
import PersonIcon from "@material-ui/icons/Person";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import TranslatorsForm from "./TranslatorsForm/TranslatorsForm";
import {
  getTranslators,
  removeTranslator,
  updateTranslator,
} from "../../services/translatorsServices/services";
import SingleTranslator from "./SingleTranslator/SingleTranslator";
import "./Translators.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ClientsForm from "../Clients/ClientsForm/ClientsForm";
import { useAlert } from "../../shared/AlertMessage/hooks";
import Loader from "../../shared/Loader/Loader";
import AlertMessage from "../../shared/AlertMessage/AlertMessage";

function Translators(props) {
  const [clients, setClients] = useState([]);
  const [translators, setTranslators] = useState([]);
  const { alertOpen, closeAlertNoReload, openAlert } = useAlert();
  const [state, setState] = useState({
    left: false,
  });
  useEffect(() => {
    getTranslators().then((res) => {
      if (res.status === 200) {
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
  //drag & drop handler
  const [currentTranslator, setCurrentTranslator] = useState(null);
  const [currentClient, setCurrentClient] = useState(null);
  function dragStartHandler(e, client) {
    setCurrentClient(client);
    e.target.style.background = "rgba(103, 128, 159, 0.5)";
  }

  function dragLeaveHandler(e) {
    if (state.left === true) {
      setState({ left: false });
    }
    if (e.target.tagName === "UL") {
      e.target.style.background = "none";
    } else if (e.target.tagName === "LI") {
      e.target.parentNode.style.background = "none"
    }
  }
  function dragEndHandler(e) {
    e.target.style.background = "none";
  }

  function dragOverHandler(e) {
    e.preventDefault();
    if (e.target.tagName === "UL") {
      e.target.style.background = "rgba(200, 247, 197, 1)";
    } else if (e.target.tagName === "LI") {
      e.target.parentNode.style.background = "rgba(200, 247, 197, 1)"
    }
  }

  function dragDropHandler(e, task, board) {
    e.preventDefault();
    e.target.style.background = "none";
  }
  function onBoardDrop(e, translatorID) {
    e.preventDefault();
    if (e.target.tagName === "UL") {
      e.target.style.background = "none";
    } else if (e.target.tagName === "LI") {
      e.target.parentNode.style.background = "none"
    }
    let editedTranslator = translators.find(
      (item) => item._id === translatorID
    );
    if (
      editedTranslator.clients.filter((item) => item._id === currentClient._id)
        .length > 0
    ) {
      openAlert();
      setTimeout(closeAlertNoReload, 1500);
    } else {
      editedTranslator = {
        ...editedTranslator,
        clients: [...editedTranslator.clients, currentClient],
      };
      updateTranslator(editedTranslator).then((res) => {
        if (res.status === 200) {
          setTranslators(
            translators.map((item) => {
              return item._id === translatorID ? editedTranslator : item;
            })
          );
        } else {
          console.log(res.data);
        }
      });
    }
  }
  function deleteClient(id) {
    removeClient(id).then((res) => {
      if (res.status === 200) {
        setClients(clients.filter((item) => item._id !== id));
      } else {
        console.log(res.data);
      }
    });
  }
  function onTranslatorDelete(id) {
    removeTranslator(id).then((res) => {
      if (res.status === 200) {
        setTranslators(translators.filter((item) => item._id !== id));
      } else {
        console.log(res.data);
      }
    });
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
          <h1 className>No translators yet.</h1>
        </div>
    );
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return isSignedIn ? (
          <div className={"main-gallery-container"}>
            <div className="control-gallery">
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
                  <div className={"side-clients-menu"}>
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
              <ClientsForm />
              <TranslatorsForm />
            </div>
            <div className={"inner-gallery-container  translators-container"}>
              <h3>List of translators:</h3>
              {page}
            </div>
            <AlertMessage
              mainText={"Translator already has this client!"}
              open={alertOpen}
              handleOpen={openAlert}
              handleClose={closeAlertNoReload}
              status={false}
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
