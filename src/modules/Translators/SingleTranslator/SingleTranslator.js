import React, { memo } from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardActions,
    CardContent,
} from '@material-ui/core'
import EditBalanceForm from '../EditBalanceForm/EditBalanceForm'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { Typography } from '@material-ui/core'
import moment from 'moment'
import { useSingleTranslator } from '../businessLogic'
import {
    calculatePercentDifference,
    calculateTranslatorMonthTotal,
} from '../../../sharedFunctions/sharedFunctions'
import {
    currentMonth,
    currentYear,
    previousDay,
    previousMonth,
} from '../../../constants/constants'
import { IconButton, Rating } from '@mui/material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowAltCircleUp,
    faArrowAltCircleDown,
} from '@fortawesome/free-solid-svg-icons'

function SingleTranslator({
    name,
    surname,
    clients,
    _id,
    statistics,
    dragOverHandler,
    onBoardDrop,
    dragLeaveHandler,
    balanceDaySubmit,
    suspendTranslator,
    suspended,
    suspendClient,
    selectedDate,
}) {
    const {
        calculateSumByClient,
        specialColorNeeded,
        getTranslatorsRating,
        calculateMiddleMonthSum,
        calculateTranslatorYesterdayTotal,
        calculateTranslatorDayTotal,
    } = useSingleTranslator(statistics, selectedDate)

    const translatorMonthTotalSum = calculateTranslatorMonthTotal(statistics)
    const translatorPreviousMonthTotalSum = calculateTranslatorMonthTotal(
        statistics,
        false,
        previousMonth
    )

    const progressPage =
        translatorMonthTotalSum >= translatorPreviousMonthTotalSum ? (
            <span className={'green-text'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                {` ${calculatePercentDifference(
                    translatorMonthTotalSum,
                    translatorPreviousMonthTotalSum
                )} %`}
            </span>
        ) : (
            <span className={'red-text'}>
                <FontAwesomeIcon icon={faArrowAltCircleDown} />
                {` ${calculatePercentDifference(
                    translatorMonthTotalSum,
                    translatorPreviousMonthTotalSum
                )} %`}
            </span>
        )

    return (
        <Card
            sx={{ minWidth: 275 }}
            className={
                suspended.status
                    ? 'translator-item translator-item--suspended'
                    : 'translator-item'
            }
            id={_id}
        >
            <CardContent>
                <Rating
                    name="read-only"
                    value={getTranslatorsRating()}
                    readOnly
                    size="small"
                />
                <Typography variant="h5" component="div">
                    {`${name} ${surname}`}
                </Typography>
                {suspended.time ? (
                    <Typography variant="caption" align={'left'}>
                        {suspended.status
                            ? `Suspended since: `
                            : `Activated since: `}
                        <b>{suspended.time}</b>
                    </Typography>
                ) : null}
                <Typography variant="body1" align={'left'}>
                    <i>Balance:</i>
                </Typography>
                <Typography variant="body2" align={'left'}>
                    Total for {`${moment().format('MMMM')}: `}
                    <b>{`${translatorMonthTotalSum} $`}</b>
                    {progressPage}
                </Typography>
                <Typography variant="body2" align={'left'}>
                    Middle for {`${moment().format('MMMM')}: `}
                    <b>{`${calculateMiddleMonthSum()} $ `}</b>
                </Typography>
                <Typography variant="body2" align={'left'}>
                    {`For yesterday: `}
                    {calculateTranslatorYesterdayTotal(statistics) ? (
                        <b>{`${calculateTranslatorYesterdayTotal(
                            statistics
                        )} $`}</b>
                    ) : (
                        'No data'
                    )}
                </Typography>
                {suspended.status ? null : (
                    <>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Active clients</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul
                                    className={'clients-list'}
                                    id={_id}
                                    onDragOver={dragOverHandler}
                                    onDragLeave={dragLeaveHandler}
                                    onDrop={e => onBoardDrop(e, _id)}
                                >
                                    <Typography variant="caption">
                                        {`Balance for ${moment(
                                            `${previousDay}/${currentMonth}/${currentYear}`,
                                            'D/M/YYYY'
                                        ).format('DD MMMM')}:`}{' '}
                                    </Typography>
                                    {clients.filter(client => !client.suspended)
                                        .length ? (
                                        clients
                                            .filter(client => !client.suspended)
                                            .sort((a, b) => {
                                                return (
                                                    Number(
                                                        calculateSumByClient(
                                                            b._id
                                                        )
                                                    ) -
                                                    Number(
                                                        calculateSumByClient(
                                                            a._id
                                                        )
                                                    )
                                                )
                                            })
                                            .map(client => (
                                                <React.Fragment
                                                    key={client._id}
                                                >
                                                    <li
                                                        className={
                                                            'clients-list__name-container'
                                                        }
                                                        id={client._id}
                                                    >
                                                        <p>
                                                            {`${client.name} ${client.surname}`}
                                                        </p>
                                                        <IconButton
                                                            color={'primary'}
                                                            variant={
                                                                'contained'
                                                            }
                                                            size={'small'}
                                                            onClick={() =>
                                                                suspendClient(
                                                                    _id,
                                                                    client._id
                                                                )
                                                            }
                                                            component="span"
                                                        >
                                                            <HighlightOffIcon />
                                                        </IconButton>
                                                    </li>
                                                    {Number(
                                                        calculateSumByClient(
                                                            client._id
                                                        )
                                                    ) ? (
                                                        <li
                                                            className={
                                                                'clients-list__finance-container'
                                                            }
                                                        >
                                                            <b
                                                                className={specialColorNeeded(
                                                                    client._id
                                                                )}
                                                            >{`${calculateSumByClient(
                                                                client._id
                                                            )} $`}</b>
                                                        </li>
                                                    ) : (
                                                        <li
                                                            className={
                                                                'clients-list__finance-container'
                                                            }
                                                        >
                                                            No balance for
                                                            yesterday
                                                        </li>
                                                    )}
                                                </React.Fragment>
                                            ))
                                    ) : (
                                        <p>Drag client here...</p>
                                    )}
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                        {clients.filter(client => client.suspended).length ? (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header-2"
                                >
                                    <Typography>Suspended clients</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ul className={'clients-list'} id={_id}>
                                        {clients
                                            .filter(client => client.suspended)
                                            .map(client => (
                                                <li
                                                    className={
                                                        'clients-list__name-container'
                                                    }
                                                    id={client._id}
                                                    key={client._id}
                                                >
                                                    <p>{`${client.name} ${client.surname}`}</p>
                                                    <IconButton
                                                        color={'success'}
                                                        variant={'contained'}
                                                        size={'small'}
                                                        onClick={() =>
                                                            suspendClient(
                                                                _id,
                                                                client._id
                                                            )
                                                        }
                                                        component="span"
                                                    >
                                                        <AddCircleOutlineIcon />
                                                    </IconButton>
                                                </li>
                                            ))}
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        ) : null}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header-2"
                            >
                                <Typography>Filtered balance</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    {`For ${selectedDate.format('DD MMMM')}: `}
                                    <b>{`${calculateTranslatorDayTotal(
                                        statistics
                                    )} $`}</b>
                                </Typography>
                                <Typography variant="body2">
                                    {`Total for ${selectedDate.format(
                                        'MMMM'
                                    )}: `}
                                    <b>{`${calculateTranslatorMonthTotal(
                                        statistics,
                                        true,
                                        selectedDate.format('M')
                                    )} $`}</b>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </>
                )}
            </CardContent>
            <CardActions>
                {clients.length && !suspended.status ? (
                    <EditBalanceForm
                        balanceDaySubmit={balanceDay =>
                            balanceDaySubmit(_id, balanceDay)
                        }
                        name={name}
                        surname={surname}
                        statistics={statistics}
                        clients={clients}
                        id={_id}
                    />
                ) : null}
                <IconButton
                    color={suspended.status ? 'default' : 'primary'}
                    variant={'contained'}
                    size={'small'}
                    onClick={() => suspendTranslator(_id)}
                    component="span"
                >
                    {suspended.status ? (
                        <PersonAddAlt1Icon />
                    ) : (
                        <PersonRemoveIcon />
                    )}
                </IconButton>
            </CardActions>
        </Card>
    )
}
export default memo(SingleTranslator)
