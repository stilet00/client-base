import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useHistory } from "react-router-dom";
import "../../styles/sharedComponents/Navigation.css";
import firebase from "firebase";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import MenuIcon from "@mui/icons-material/Menu";
import WorkIcon from "@mui/icons-material/Work";
import PageviewIcon from "@mui/icons-material/Pageview";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function Navigation() {
  const history = useHistory();
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const logoutButton = (
    <ListItem
      button
      onClick={() => {
        firebase.auth().signOut();
        setTimeout(() => {
          history.push("/");
        }, 1000);
      }}
    >
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText primary={"Log out"} />
    </ListItem>
  );

  const list = (anchor) => (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return (
          <div
            className={clsx(classes.list, {
              [classes.fullList]: anchor === "top" || anchor === "bottom",
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
          >
            <List className={"fallDown-menu"}>
              <ListItem button onClick={() => history.push("/overview")}>
                <ListItemIcon>
                  <PageviewIcon />
                </ListItemIcon>
                <ListItemText primary={"Overview"} />
              </ListItem>
              <ListItem button onClick={() => history.push("/chart")}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary={"Balance chart"} />
              </ListItem>
              <ListItem button onClick={() => history.push("/tasks")}>
                <ListItemIcon>
                  <FormatListNumberedIcon />
                </ListItemIcon>
                <ListItemText primary={"Task List"} />
              </ListItem>
              <ListItem button onClick={() => history.push("/translators")}>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary={"Translators"} />
              </ListItem>
              {isSignedIn ? logoutButton : null}
            </List>
          </div>
        );
      }}
    </FirebaseAuthConsumer>
  );

  return (
    <div className={"socials upper-menu"}>
      <Button
        onClick={toggleDrawer("top", true)}
        fullWidth
        startIcon={<MenuIcon />}
      >
        Navigation
      </Button>
      <Drawer
        anchor={"top"}
        open={state["top"]}
        onClose={toggleDrawer("top", false)}
      >
        {list("top")}
      </Drawer>
    </div>
  );
}
