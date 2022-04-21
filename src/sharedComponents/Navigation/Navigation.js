import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Media from "react-media";
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
import MenuIcon from "@mui/icons-material/Menu";
import WorkIcon from "@mui/icons-material/Work";
import PageviewIcon from "@mui/icons-material/Pageview";
import { IconButton } from "@mui/material";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function Navigation({ user }) {
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

  const list = (anchor) => (
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
        <ListItem button onClick={() => history.push("/translators")}>
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary={"Translators & Balance"} />
        </ListItem>
        <ListItem button onClick={() => history.push("/chart")}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary={"Charts"} />
        </ListItem>
        <ListItem button onClick={() => history.push("/tasks")}>
          <ListItemIcon>
            <FormatListNumberedIcon />
          </ListItemIcon>
          <ListItemText primary={"Task List"} />
        </ListItem>
          {user ? (
              <ListItem
                  button
                  onClick={() => {
                      firebase.auth().signOut();
                  }}
              >
                  <ListItemIcon>
                      <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Log out"} />
              </ListItem>
          ) : null}
      </List>
    </div>
  );

  return user ? (
    <div className="App-header">
      <Media
        query="(min-width: 840px)"
        render={() => (
          <List className={"header_nav"}>
            <ListItem button onClick={() => history.push("/overview")}>
              <ListItemIcon>
                <PageviewIcon />
              </ListItemIcon>
              <ListItemText primary={"Overview"} />
            </ListItem>
            <ListItem button onClick={() => history.push("/translators")}>
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary={"Translators & Balance"} />
            </ListItem>
            <ListItem button onClick={() => history.push("/chart")}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary={"Charts"} />
            </ListItem>
            <ListItem button onClick={() => history.push("/tasks")}>
              <ListItemIcon>
                <FormatListNumberedIcon />
              </ListItemIcon>
              <ListItemText primary={"Task List"} />
            </ListItem>
            {user ? (
              <ListItem
                button
                onClick={() => {
                  firebase.auth().signOut();
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary={"Log out"} />
              </ListItem>
            ) : null}
          </List>
        )}
      />
      <Media
        query="(max-width: 839px)"
        render={() => (
          <>
            <IconButton onClick={toggleDrawer("top", true)} fullWidth>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor={"top"}
              open={state["top"]}
              onClose={toggleDrawer("top", false)}
            >
              {list("top")}
            </Drawer>
          </>
        )}
      />
    </div>
  ) : null;
}
