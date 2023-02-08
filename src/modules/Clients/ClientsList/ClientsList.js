import { React, useState } from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import WomanIcon from '@mui/icons-material/Woman'
import ListItemText from '@material-ui/core/ListItemText'
import '../../../styles/modules/Clients.css'
import { useClientsList } from '../businessLogic'
import moment from 'moment'
import { Rating } from '@mui/material'
import { calculatePercentDifference } from '../../../sharedFunctions/sharedFunctions'
import {
    faArrowAltCircleUp,
    faArrowAltCircleDown,
    faListAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useWindowDimensions from '../../../sharedHooks/useWindowDimensions'
import { getClientsRating } from '../../../sharedFunctions/sharedFunctions'

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
    translators,
    clients,
    toggleDrawer,
    state,
    dragStartHandler,
    dragOverHandler,
    dragLeaveHandler,
    dragEndHandler,
    dragDropHandler,
}) {
    const { screenIsSmall } = useWindowDimensions()
    const { clientMonthSum, sortBySum, calculateMiddleMonthSum } =
        useClientsList(translators)
    const [search, setSearch] = useState('')
    function onSearchChange(e) {
        setSearch(e.target.value.toLowerCase())
    }
    return (
        <>
            <Button
                onClick={toggleDrawer('left', true)}
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
                    <ul>
                        {clients
                            .filter(client =>
                                `${client.name} ${client.surname}`
                                    .toLowerCase()
                                    .includes(search)
                            )
                            .sort(sortBySum)
                            .map((client, index) => {
                                const memoizedMiddleMonthSum =
                                    calculateMiddleMonthSum(client._id)
                                const memoizedPreviousMiddleMonthSum =
                                    calculateMiddleMonthSum(
                                        client._id,
                                        moment().subtract(1, 'month')
                                    )
                                const memoizedMonthSum = clientMonthSum(
                                    client._id
                                )
                                const memoizedPreviousMonthSum = clientMonthSum(
                                    client._id,
                                    moment().subtract(1, 'month')
                                )
                                const progressPage =
                                    memoizedMiddleMonthSum >=
                                    memoizedPreviousMiddleMonthSum ? (
                                        <span>
                                            {`Middle for ${moment().format(
                                                'MMMM'
                                            )}: `}
                                            <span
                                                className={
                                                    'blue-text styled-text-numbers'
                                                }
                                            >
                                                {`${memoizedMiddleMonthSum} $`}
                                            </span>
                                            <span
                                                className={
                                                    'green-text styled-text-numbers'
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faArrowAltCircleUp}
                                                />
                                                {` ${calculatePercentDifference(
                                                    memoizedMiddleMonthSum,
                                                    memoizedPreviousMiddleMonthSum
                                                )} %`}
                                            </span>
                                        </span>
                                    ) : (
                                        <span>
                                            {`Middle for ${moment().format(
                                                'MMMM'
                                            )}: `}
                                            <span
                                                className={
                                                    'blue-text styled-text-numbers'
                                                }
                                            >
                                                {`${memoizedMiddleMonthSum} $`}
                                            </span>
                                            <span
                                                className={
                                                    'red-text styled-text-numbers'
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faArrowAltCircleDown}
                                                />
                                                {` ${calculatePercentDifference(
                                                    memoizedMiddleMonthSum,
                                                    memoizedPreviousMiddleMonthSum
                                                )} %`}
                                            </span>
                                        </span>
                                    )
                                const totalPage = (
                                    <span>
                                        {`Balance for ${moment().format(
                                            'MMMM'
                                        )}: `}
                                        <span
                                            className={
                                                'blue-text styled-text-numbers'
                                            }
                                        >
                                            {`${memoizedMonthSum} $`}
                                        </span>
                                    </span>
                                )

                                const previousTotalPage = (
                                    <span>
                                        {`Balance for ${moment()
                                            .subtract(1, 'month')
                                            .format('MMMM')}: `}
                                        <span
                                            className={
                                                'blue-text styled-text-numbers'
                                            }
                                        >
                                            {`${memoizedPreviousMonthSum} $`}
                                        </span>
                                    </span>
                                )
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
                                            primary={`${client.name} ${client.surname}`}
                                        />
                                        <Rating
                                            name="read-only"
                                            value={getClientsRating(
                                                memoizedMiddleMonthSum
                                            )}
                                            readOnly
                                            size="small"
                                        />
                                        {/*<Button onClick={() => deleteClient(client._id)} disabled>*/}
                                        {/*  <DeleteForeverIcon />*/}
                                        {/*</Button>*/}
                                        <ListItemText
                                            className={
                                                'side-clients-menu__client__balance-container'
                                            }
                                            secondary={totalPage}
                                        ></ListItemText>
                                        <ListItemText
                                            className={
                                                'side-clients-menu__client__balance-container'
                                            }
                                            secondary={progressPage}
                                        />
                                        <ListItemText
                                            className={
                                                'side-clients-menu__client__balance-container'
                                            }
                                            secondary={previousTotalPage}
                                        />
                                    </li>
                                )
                            })}
                    </ul>
                </div>
            </Drawer>
        </>
    )
}

export default ClientsList
