import React from 'react'
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
    const {
        clientMonthSum,
        sortBySum,
        getClientsRating,
        calculateMiddleMonthSum,
        getAllAsignedTranslators,
    } = useClientsList(translators)

    return (
        <>
            <Button
                onClick={toggleDrawer('left', true)}
                fullWidth
                startIcon={<FontAwesomeIcon icon={faListAlt} />}
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
                        All clients:
                    </h3>
                    <ul>
                        {clients.sort(sortBySum).map(client => {
                            const memoizedMiddleMonthSum =
                                calculateMiddleMonthSum(client._id)
                            const memoizedPreviousMiddleMonthSum =
                                calculateMiddleMonthSum(
                                    client._id,
                                    moment().subtract(1, 'month')
                                )
                            const memoizedMonthSum = clientMonthSum(client._id)
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
                                        <span className={'blue-text'}>
                                            {`${memoizedMiddleMonthSum} $`}
                                        </span>
                                        <span className={'green-text'}>
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
                                        <span className={'blue-text'}>
                                            {`${memoizedMiddleMonthSum} $`}
                                        </span>
                                        <span className={'red-text'}>
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
                                    {`Balance for ${moment().format('MMMM')}: `}
                                    <span className={'blue-text'}>
                                        {`${memoizedMonthSum} $`}
                                    </span>
                                </span>
                            )

                            const previousTotalPage = (
                                <span>
                                    {`Balance for ${moment()
                                        .subtract(1, 'month')
                                        .format('MMMM')}: `}
                                    <span className={'blue-text'}>
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
                                        value={getClientsRating(client._id)}
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
                                    <ListItemText
                                        className={
                                            'side-clients-menu__client__balance-container'
                                        }
                                        secondary={`Assigned at ${
                                            getAllAsignedTranslators(client._id)
                                                .length
                                        } translators: ${getAllAsignedTranslators(
                                            client._id
                                        ).join(', ')}`}
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
