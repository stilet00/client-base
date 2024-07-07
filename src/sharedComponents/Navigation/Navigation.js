import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import Drawer from "@mui/material/Drawer";
import Media from "react-media";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";
import "../../styles/sharedComponents/Navigation.css";
import firebase from "firebase";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import WorkIcon from "@mui/icons-material/Work";
import PageViewIcon from "@mui/icons-material/Pageview";
import GroupIcon from "@mui/icons-material/Group";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import { BottomNavigationAction, IconButton } from "@mui/material";
import styled, { keyframes } from "styled-components";
import { fadeInRight } from "react-animations";
import Typography from "@mui/material/Typography";
import BottomNavigation from "@mui/material/BottomNavigation";
import { useLocation } from "react-router-dom";
import { localStorageTokenKey } from "../../constants/constants";
import { useAdminStatus } from "../../sharedHooks/useAdminStatus";
import { clearUser } from "../../features/authSlice";

const Animation = styled.div`
    animation: 1s ${keyframes`${fadeInRight}`};
    width: 100%;
    height: 100%;
`;

const routes = [
	{
		path: "/overview",
		label: "Overview",
		icon: <PageViewIcon />,
		adminOnly: false,
	},
	{
		path: "/finances",
		label: "Finance Statement",
		icon: <PriceChangeOutlinedIcon />,
		adminOnly: true,
	},
	{
		path: "/clients",
		label: "Clients",
		icon: <GroupIcon />,
		adminOnly: false,
	},
	{
		path: "/translators",
		label: "Translators & Balance",
		icon: <WorkIcon />,
		adminOnly: false,
	},
	{
		path: "/chart",
		label: "Charts",
		icon: <BarChartIcon />,
		adminOnly: false,
	},
	{
		path: "/tasks",
		label: "Task List",
		icon: <FormatListNumberedIcon />,
		adminOnly: false,
	},
	{
		path: "/business-admins",
		label: "Business Administrators",
		icon: <SupervisorAccountIcon />,
		adminOnly: true,
	},
];

const HeaderNavigationItem = ({ label, icon, to, onClick }) => {
	const navigate = useNavigate();
	return (
		<ListItem button onClick={() => (onClick ? onClick() : navigate(to))}>
			<ListItemIcon>{icon}</ListItemIcon>
			<ListItemText primary={label} />
		</ListItem>
	);
};

const removeUserIdTokenFromLocalStorage = () => {
	window.localStorage.removeItem(localStorageTokenKey);
};

export default function Navigation() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);
	const navigate = useNavigate();
	let { pathname } = useLocation();
	const [state, setState] = useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	});
	const { isAdmin } = useAdminStatus(user);

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setState({ ...state, [anchor]: open });
	};

	const onLogOut = () => {
		firebase.auth().signOut();
		removeUserIdTokenFromLocalStorage();
		dispatch(clearUser());
	};

	const list = (anchor) => (
		<div
			className={clsx(
				{ width: 250 },
				{
					[{
						width: "auto",
					}]: anchor === "top" || anchor === "bottom",
				},
			)}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List className={"fallDown-menu"}>
				{routes.map(
					(route, index) =>
						(!route.adminOnly || isAdmin) && (
							<HeaderNavigationItem
								key={index}
								label={route.label}
								icon={route.icon}
								to={route.path}
							/>
						),
				)}
				{user ? (
					<ListItem button onClick={onLogOut}>
						<ListItemIcon>
							<ExitToAppIcon />
						</ListItemIcon>
						<ListItemText primary={"Log out"} />
					</ListItem>
				) : null}
			</List>
		</div>
	);

	if (!user) {
		return null;
	}

	return (
		<div className="App-header">
			<Media
				query="(min-width: 840px)"
				render={() => (
					<Animation>
						<BottomNavigation
							showLabels
							value={pathname}
							onChange={(event, newValue) => {
								navigate(newValue);
							}}
							className={"header_nav gradient-box"}
						>
							{routes.map(
								(route, index) =>
									(!route.adminOnly || isAdmin) && (
										<BottomNavigationAction
											key={index}
											label={route.label}
											icon={route.icon}
											value={route.path}
										/>
									),
							)}
							<ListItem button onClick={onLogOut}>
								<ListItemIcon>
									<ExitToAppIcon />
								</ListItemIcon>
								<ListItemText primary={"Log out"} />
							</ListItem>
						</BottomNavigation>
					</Animation>
				)}
			/>
			<Media
				query="(max-width: 839px)"
				render={() => (
					<>
						<IconButton onClick={toggleDrawer("top", true)}>
							<MenuIcon />
						</IconButton>
						<Typography variant="h5" component={"h5"}>
							Navigation
						</Typography>
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
	);
}
