import { useEffect, useState } from 'react';
import Header from "../../shared/Header/Header";
import Unauthorized from "../../shared/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { getClients } from "../../services/clientsServices/services";
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import TranslatorsForm from "./TranslatorsForm/TranslatorsForm";
import { getTranslators } from "../../services/translatorsServices/services";
import SingleTranslator from "./SingleTranslator/SingleTranslator";
import "./Translators.css"

function Translators (props) {
    const [clients, setClients] = useState([]);
    const [translators, setTranslators] = useState([]);
    const [state, setState] = useState({
        left: false,
    });
    useEffect(() => {
        getTranslators().then(res => {
            if (res.status === 200) {
                setTranslators(res.data);
                console.log(res.data);
            } else {
                console.log("No translators")
            }
        })
        getClients().then(res => {
            if (res.status === 200) {
                setClients(res.data);
                console.log(res.data);
            } else {
                console.log("No clients")
            }
        })
    }, [])
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    //drag & drop handler
    const [currentTranslator, setCurrentTranslator] = useState(null)
    const [currentClient, setCurrentClient] = useState(null)
    function dragStartHandler (e, client) {
        setCurrentClient(client);
        e.target.style.background = "rgba(103, 128, 159, 0.5)";
    }

    function dragLeaveHandler (e) {
        if (state.left === true) {
            setState({ left: false })
        }
        console.log(e.target)
        e.target.style.background = "none"
    }
    function dragEndHandler (e) {
        e.target.style.background = "none"

    }

    function dragOverHandler (e) {
        e.preventDefault();
        if (e.target.tagName === "UL") {
            e.target.style.background = "rgba(255,165,0,1)"
        }
    }

    function dragDropHandler (e, task, board) {
        e.preventDefault();
    }
    function onBoardDrop(e, translatorID) {
        e.preventDefault();
        e.target.style.background = "none"
        setTranslators(translators.map(item => {
            return item._id === translatorID ? {...item, clients: [...item.clients, currentClient]} : item
        }))
        setClients(clients.filter(item => item._id !== currentClient._id))
        setCurrentClient(null);

    }
    return (
        <FirebaseAuthConsumer>
            {({ isSignedIn, user, providerId }) => {
                return isSignedIn ? (
                    <div className={"main-gallery-container"}>
                        <div className="control-gallery">
                            <Header pretty={{ borderBottom: "1px solid #50C878" }} />
                            <div className={"socials button-add-container middle-button"}>
                                        <Button onClick={toggleDrawer("left", true)} fullWidth>Show clients</Button>
                                        <Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
                                            <div className={"side-clients-menu"}>
                                            <h3>Unassigned clients:</h3>
                                            <ul>
                                                {clients.map((client, index) => (
                                                    <li key={client._id} className={"left-menu-item"}
                                                        draggable={true}
                                                        onDragStart={(e) => dragStartHandler(e, client)}
                                                        onDragOver={dragOverHandler}
                                                        onDragLeave={dragLeaveHandler}
                                                        onDragEnd={dragEndHandler}
                                                        onDrop={(e) => dragDropHandler(e)}
                                                    >
                                                        <ListItemIcon>{index % 2 === 0 ? <PersonIcon /> : <PersonOutlineIcon />}</ListItemIcon>
                                                        <ListItemText primary={`${client.name} ${client.surname}`} />
                                                    </li>
                                                ))}
                                            </ul>
                                            </div>
                                        </Drawer>
                            </div>
                            <TranslatorsForm />
                        </div>
                        <div className={"inner-gallery-container  translators-container"}>
                            {translators.map(item => <SingleTranslator {...item} key={item._id} dragOverHandler={dragOverHandler} onBoardDrop={onBoardDrop} dragLeaveHandler={dragLeaveHandler}/>)}
                        </div>
                    </div>
                ) : (
                    <Unauthorized />
                );
            }}
        </FirebaseAuthConsumer>
    );
}

export default Translators;