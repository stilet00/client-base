import React, { useEffect, useState } from 'react';
import Header from "../../shared/Header/Header";
import Unauthorized from "../../shared/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { getClients } from "../../services/clientsServices/services";
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import TranslatorsForm from "./TranslatorsForm/TranslatorsForm";
import { getTranslators } from "../../services/translatorsServices/services";
import SingleTranslator from "./SingleTranslator/SingleTranslator";
import "./Translators.css"
import { Divider } from "@material-ui/core";
const useStyles = makeStyles({
    list: {
        width: 250,
    },
    color: {
        color: "red",
        fontWeight: "bold",
        textAlign: "center"
    },
    blackDivider: {
        backgroundColor: "black"
    }
});
function Translators (props) {
    const [clients, setClients] = useState([]);
    const [translators, setTranslators] = useState([]);
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
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
    const list = (anchor) => (
        <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List className={"fallDown-menu"}>
                <ListItem>
                    <ListItemText primary={"Not assigned clients:"} className={classes.color}/>
                </ListItem>
            </List>
            <Divider />
            <List className={"fallDown-menu"}>
                {clients.map((client, index) => (
                    <ListItem button key={client._id} draggable={true}>
                        <ListItemIcon>{index % 2 === 0 ? <PersonIcon /> : <PersonOutlineIcon />}</ListItemIcon>
                        <ListItemText primary={`${client.name} ${client.surname}`} />
                    </ListItem>
                ))}
            </List>

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
                                        <Button onClick={toggleDrawer("left", true)} fullWidth>Show clients</Button>
                                        <Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
                                            <div className={"side-clients-menu"}>
                                            <h3>Unassigned clients:</h3>
                                            <ul>
                                                {clients.map((client, index) => (
                                                    <li key={client._id} draggable={true} className={"left-menu-item"}>
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
                            {translators.map(item => <SingleTranslator {...item} key={item._id}/>)}
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