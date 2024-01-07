import { React, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import WomanIcon from '@mui/icons-material/Woman'
import ListItemText from '@mui/material/ListItemText'
import '../../../styles/modules/Clients.css'
import { getClients } from 'services/clientsServices/services'
import { faListAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useWindowDimensions from 'sharedHooks/useWindowDimensions'
import Loader from 'sharedComponents/Loader/Loader'
import { useAlert } from 'sharedComponents/AlertMessage/hooks'
import AlertMessage from 'sharedComponents/AlertMessage/AlertMessage'
import MESSAGES from 'constants/messages'

const SearchTextField = styled.input`
    padding: 0;
    background: transparent;
    border: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    margin-left: 1rem;
    max-width: 50%;
    overflow-x: auto;
    outline: none;
`

function ClientsList({
    toggleDrawer,
    state,
    dragStartHandler,
    dragOverHandler,
    dragLeaveHandler,
    dragEndHandler,
    dragDropHandler,
}) {
    const user = useSelector(state => state.auth.user)
    const { screenIsSmall } = useWindowDimensions()
    const [search, setSearch] = useState('')
    const [clients, setClients] = useState([])
    const { alertOpen, closeAlert, openAlert, message } = useAlert()

    const fetchClients = async () => {
        const response = await getClients({
            noImageParams: true,
            searchQuery: search,
        })
        if (response.status !== 200)
            throw new Error(MESSAGES.somethingWrongWithGettingClients)
        return response.data
    }

    const { isLoading: clientsAreLoading } = useQuery(
        ['clientsForTranslators', search],
        fetchClients,
        {
            enabled: !!user,
            onSuccess: data => setClients(data),
            onError: () => openAlert(MESSAGES.somethingWrongWithGettingClients),
        }
    )

    function onSearchChange(e) {
        setSearch(e.target.value.toLowerCase())
    }
    return (
        <>
            <Button
                onClick={toggleDrawer('left', true)}
                sx={{
                    color: 'black',
                }}
                fullWidth={screenIsSmall}
                startIcon={<FontAwesomeIcon icon={faListAlt} />}
                className="translators-container__menu-button"
            >
                Show clients
            </Button>

            <Drawer
                anchor={'left'}
                open={state['left']}
                onClose={toggleDrawer('left', false)}
            >
                <div className={'side-clients-menu fallDown-menu'}>
                    <h3>
                        <WomanIcon />
                        All clients:{' '}
                        <SearchTextField
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={onSearchChange}
                        ></SearchTextField>
                    </h3>
                    {clientsAreLoading && <Loader />}
                    {!clientsAreLoading && (
                        <ul id="on-scroll__slide-animation-list">
                            {clients.map((client, index) => {
                                return (
                                    <li
                                        key={client._id}
                                        id={client._id}
                                        className={'side-clients-menu__client'}
                                        draggable={true}
                                        onDragStart={e =>
                                            dragStartHandler(e, client)
                                        }
                                        onDragOver={dragOverHandler}
                                        onDragLeave={dragLeaveHandler}
                                        onDragEnd={dragEndHandler}
                                        onDrop={e => dragDropHandler(e)}
                                    >
                                        <ListItemText
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            primary={`${client.name} ${client.surname}`}
                                        />
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </Drawer>
            <AlertMessage
                mainText={message.text}
                open={alertOpen}
                handleOpen={openAlert}
                handleClose={closeAlert}
                status={message.status}
            />
        </>
    )
}

export default ClientsList
