import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import BarChartIcon from '@material-ui/icons/BarChart';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function Header() {
    const history = useHistory();
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                    <ListItem button onClick={() => history.push('/tasks')}>
                        <ListItemIcon><FormatListNumberedIcon /></ListItemIcon>
                        <ListItemText primary={"Task List"} />
                    </ListItem>
                    <ListItem button onClick={() => history.push('/chart')}>
                        <ListItemIcon><BarChartIcon /></ListItemIcon>
                        <ListItemText primary={"Balance chart"} />
                    </ListItem>
            </List>
            <Divider />
            {/*<List>*/}
            {/*    {['All mail', 'Trash', 'Spam'].map((text, index) => (*/}
            {/*        <ListItem button key={text}>*/}
            {/*            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>*/}
            {/*            <ListItemText primary={text} />*/}
            {/*        </ListItem>*/}
            {/*    ))}*/}
            {/*</List>*/}
        </div>
    );

    return (
                <>
                    <Button onClick={toggleDrawer("top", true)} variant={"outlined"} style={{marginBottom: "10px"}}>Menu</Button>
                    <Drawer anchor={"top"} open={state["top"]} onClose={toggleDrawer("top", false)}>
                        {list("top")}
                    </Drawer>
                </>
    );
}
