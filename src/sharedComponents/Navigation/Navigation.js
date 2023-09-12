import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import Drawer from '@mui/material/Drawer'
import Media from 'react-media'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import BarChartIcon from '@mui/icons-material/BarChart'
import { useHistory } from 'react-router-dom'
import '../../styles/sharedComponents/Navigation.css'
import firebase from 'firebase'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MenuIcon from '@mui/icons-material/Menu'
import WorkIcon from '@mui/icons-material/Work'
import PageViewIcon from '@mui/icons-material/Pageview'
import GroupIcon from '@mui/icons-material/Group'
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined'
import { BottomNavigationAction, IconButton } from '@mui/material'
import styled, { keyframes } from 'styled-components'
import { fadeInRight } from 'react-animations'
import Typography from '@mui/material/Typography'
import BottomNavigation from '@mui/material/BottomNavigation'
import { useLocation } from 'react-router-dom/cjs/react-router-dom'
import { localStorageTokenKey } from '../../constants/constants'
import { useAdminStatus } from '../../sharedHooks/useAdminStatus'
import { clearUser } from '../../features/authSlice'

const Animation = styled.div`
    animation: 1s ${keyframes`${fadeInRight}`};
    width: 100%;
    height: 100%;
`

export default function Navigation() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const history = useHistory()
    let { pathname } = useLocation()
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    })

    const [page, setPage] = useState(pathname)
    const { isAdmin } = useAdminStatus(user)

    useEffect(() => {
        setPage(pathname)
    }, [user, pathname])

    useEffect(() => {
        return () => {
            setPage(pathname)
        }
    }, [])

    const toggleDrawer = (anchor, open) => event => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }
        setState({ ...state, [anchor]: open })
    }

    const onLogOut = () => {
        firebase.auth().signOut()
        removeUserIdTokenFromLocalStorage()
        dispatch(clearUser())
    }

    const list = anchor => (
        <div
            className={clsx(
                { width: 250 },
                {
                    [{
                        width: 'auto',
                    }]: anchor === 'top' || anchor === 'bottom',
                }
            )}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List className={'fallDown-menu'}>
                <ListItem button onClick={() => history.push('/overview')}>
                    <ListItemIcon>
                        <PageViewIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Overview'} />
                </ListItem>
                <ListItem button onClick={() => history.push('/finances')}>
                    <ListItemIcon>
                        <PriceChangeOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Finance Statement'} />
                </ListItem>
                <ListItem button onClick={() => history.push('/clients')}>
                    <ListItemIcon>
                        <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Clients'} />
                </ListItem>
                <ListItem button onClick={() => history.push('/translators')}>
                    <ListItemIcon>
                        <WorkIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Translators & Balance'} />
                </ListItem>
                <ListItem button onClick={() => history.push('/chart')}>
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Charts'} />
                </ListItem>
                <ListItem button onClick={() => history.push('/tasks')}>
                    <ListItemIcon>
                        <FormatListNumberedIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Task List'} />
                </ListItem>
                {user ? (
                    <ListItem button onClick={onLogOut}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Log out'} />
                    </ListItem>
                ) : null}
            </List>
        </div>
    )

    const removeUserIdTokenFromLocalStorage = () => {
        window.localStorage.removeItem(localStorageTokenKey)
    }

    return user ? (
        <div className="App-header">
            <Media
                query="(min-width: 840px)"
                render={() => (
                    <Animation>
                        <BottomNavigation
                            showLabels
                            value={page}
                            onChange={(event, newValue) => {
                                history.push(newValue)
                                setPage(newValue)
                            }}
                            className={'header_nav gradient-box'}
                        >
                            <BottomNavigationAction
                                label="Overview"
                                icon={<PageViewIcon />}
                                value={'/overview'}
                            />
                            {isAdmin && (
                                <BottomNavigationAction
                                    label="Finance Statement"
                                    icon={<PriceChangeOutlinedIcon />}
                                    value={'/finances'}
                                />
                            )}
                            <BottomNavigationAction
                                label="Clients"
                                icon={<GroupIcon />}
                                value={'/clients'}
                            />
                            <BottomNavigationAction
                                label="Translators & Balance"
                                icon={<WorkIcon />}
                                value={'/translators'}
                            />
                            <BottomNavigationAction
                                label="Charts"
                                icon={<BarChartIcon />}
                                value={'/chart'}
                            />
                            {isAdmin && (
                                <BottomNavigationAction
                                    label="Task List"
                                    icon={<FormatListNumberedIcon />}
                                    value={'/tasks'}
                                />
                            )}
                            <ListItem button onClick={onLogOut}>
                                <ListItemIcon>
                                    <ExitToAppIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Log out'} />
                            </ListItem>
                        </BottomNavigation>
                    </Animation>
                )}
            />
            <Media
                query="(max-width: 839px)"
                render={() => (
                    <>
                        <IconButton onClick={toggleDrawer('top', true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" component={'h5'}>
                            Navigation
                        </Typography>
                        <Drawer
                            anchor={'top'}
                            open={state['top']}
                            onClose={toggleDrawer('top', false)}
                        >
                            {list('top')}
                        </Drawer>
                    </>
                )}
            />
        </div>
    ) : null
}
