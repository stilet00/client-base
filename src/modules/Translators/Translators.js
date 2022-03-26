import Menu from "../../sharedComponents/Menu/Menu";
import Unauthorized from "../AuthorizationPage/Unauthorized/Unauthorized";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import TranslatorsForm from "./TranslatorsForm/TranslatorsForm";
import SingleTranslator from "./SingleTranslator/SingleTranslator";
import "../../styles/modules/Translators.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ClientsForm from "../Clients/ClientsForm/ClientsForm";
import Loader from "../../sharedComponents/Loader/Loader";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { useTranslators } from "./businessLogic";
import AlertMessageConfirmation from "../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation";

function Translators({ user }) {
  const {
    translators,
    clients,
    dragLeaveHandler,
    dragOverHandler,
    loading,
    onBoardDrop,
    onTranslatorDelete,
    state,
    toggleDrawer,
    openAlert,
    closeAlert,
    alertOpen,
    clientsFormSubmit,
    deleteClient,
    dragDropHandler,
    dragEndHandler,
    dragStartHandler,
    message,
    translatorsFormSubmit,
    balanceDaySubmit,
    alertStatusConfirmation,
    openAlertConfirmation,
    closeAlertConfirmationNoReload,
  } = useTranslators(user);

  return user ? (
    <div className={"gallery-container"}>
      <div className="gallery-menu gallery-menu_no-border">
        <Menu pretty={{ borderBottom: "1px solid #50C878" }} />
        <div className={"socials button-add-container middle-button"}>
          <Button
            onClick={toggleDrawer("left", true)}
            fullWidth
            startIcon={<ListAltIcon />}
          >
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
                      {index % 2 === 0 ? <PersonIcon /> : <PersonOutlineIcon />}
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
      <div
        className={"inner-gallery-container translators-container animated-box"}
      >
        {translators.length > 0 ? (
          translators.map((item) => (
            <SingleTranslator
              deleteTranslator={onTranslatorDelete}
              {...item}
              key={item._id}
              dragOverHandler={dragOverHandler}
              onBoardDrop={onBoardDrop}
              dragLeaveHandler={dragLeaveHandler}
              balanceDaySubmit={balanceDaySubmit}
              alertStatusConfirmation={alertStatusConfirmation}
              openAlertConfirmation={openAlertConfirmation}
              closeAlertConfirmationNoReload={closeAlertConfirmationNoReload}
            />
          ))
        ) : (
          <div className="empty">
            {loading ? <Loader /> : <h1>No translators yet.</h1>}
          </div>
        )}
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
}

export default Translators;
