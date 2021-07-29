import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import BarChartIcon from "@material-ui/icons/BarChart";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { useHistory } from "react-router-dom";
import "./Header.css";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function Header({ pretty }) {
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
        <ListItem button onClick={() => history.push("/tasks")}>
          <ListItemIcon>
            <FormatListNumberedIcon />
          </ListItemIcon>
          <ListItemText primary={"Task List"} />
        </ListItem>
        <ListItem button onClick={() => history.push("/chart")}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary={"Balance chart"} />
        </ListItem>
        <ListItem button onClick={() => history.push("/clients/true")}>
          <ListItemIcon>
            <SupervisorAccountIcon />
          </ListItemIcon>
          <ListItemText primary={"Clients"} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div
      className={"socials button-add-container menu-container upper-menu"}
      style={pretty}
    >
      <Button onClick={toggleDrawer("top", true)} fullWidth>
        Menu
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
