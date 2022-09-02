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
    faPersonCircleXmark,
    faPersonCirclePlus,
} from '@fortawesome/free-solid-svg-icons'
import PersonalPenaltyForm from '../PersonalPenaltyForm/PersonalPenaltyForm'
import PenaltiesList from '../PenaltiesList/PenaltiesList'
import EditTranslatorEmailForm from '../EditTranslatorEmailForm/EditTranslatorEmailForm'

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
    addPersonalPenaltyToTranslator,
    personalPenalties,
    email,
    updateTranslatorEmail,
    wantsToReceiveEmails,
}) {
    const {
        calculateSumByClient,
        specialColorNeeded,
        getTranslatorsRating,
        calculateMiddleMonthSum,
        calculateTranslatorYesterdayTotal,
        calculateTranslatorDayTotal,
        calculatePersonalPenalties,
    } = useSingleTranslator(statistics, selectedDate, personalPenalties)

    const translatorMonthTotalSum = calculateTranslatorMonthTotal(statistics)
    const translatorPreviousMonthTotalSum = calculateTranslatorMonthTotal(
        statistics,
        false,
        previousMonth
    )

    const progressPage =
        translatorMonthTotalSum >= translatorPreviousMonthTotalSum ? (
            <span className={'green-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                {` ${calculatePercentDifference(
                    translatorMonthTotalSum,
                    translatorPreviousMonthTotalSum
                )} %`}
            </span>
        ) : (
            <span className={'red-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleDown} />
                {` ${calculatePercentDifference(
                    translatorMonthTotalSum,
                    translatorPreviousMonthTotalSum
                )} %`}
            </span>
        )
    const currentMonth =
        moment().format('MMMM').length > '5'
            ? moment().format('MMM')
            : moment().format('MMMM')

    return (
        <Card
            sx={{ minWidth: 275 }}
            className={
                suspended.status
                    ? 'translator-item translator-item--suspended'
                    : 'translator-item gradient-box'
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
                <div
                    style={{
                        minHeight: 135,
                    }}
                >
                    <Typography variant="h5" component="div">
                        {`${name} ${surname}`}
                    </Typography>
                    <div>
                        <EditTranslatorEmailForm
                            email={email}
                            updateTranslatorEmail={updateTranslatorEmail}
                            wantsToReceiveEmails={wantsToReceiveEmails}
                            id={_id}
                        />
                    </div>
                    {suspended.time ? (
                        <Typography
                            variant="caption"
                            align={'left'}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            {suspended.status
                                ? `Suspended since: `
                                : `Activated since: `}
                            <b>{suspended.time}</b>
                        </Typography>
                    ) : null}
                    <Typography
                        variant="body2"
                        align={'left'}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span style={{ maxWidth: '40%' }}>
                            Total for {currentMonth}:
                        </span>
                        {progressPage}
                        <b className="styled-text-numbers">{`${translatorMonthTotalSum} $`}</b>
                    </Typography>
                    <Typography
                        variant="body2"
                        align={'left'}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>Middle for {currentMonth}:</span>
                        <b>{`${calculateMiddleMonthSum()} $ `}</b>
                    </Typography>
                    <Typography
                        variant="body2"
                        align={'left'}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        {`For yesterday: `}
                        {calculateTranslatorYesterdayTotal(statistics) ? (
                            <b className="styled-text-numbers">
                                {`${calculateTranslatorYesterdayTotal(
                                    statistics
                                )} $`}
                            </b>
                        ) : (
                            'No data'
                        )}
                    </Typography>
                    {calculatePersonalPenalties()?.thisMonthsPenaltiesArray
                        .length ? (
                        <Typography
                            variant="body2"
                            align={'left'}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            Penalties for {`${moment().format('MMMM')}: `}
                            <PenaltiesList
                                penaltiesArray={personalPenalties.filter(
                                    penalty =>
                                        penalty.date.slice(3) ===
                                        moment().format('MM YYYY')
                                )}
                            />
                        </Typography>
                    ) : null}
                </div>
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
                                {calculatePersonalPenalties()
                                    ?.selectedDatePenaltiesArray.length ? (
                                    <Typography variant="body2" align={'left'}>
                                        Penalties for{' '}
                                        {`${selectedDate.format('MMMM')}: `}
                                        <PenaltiesList
                                            penaltiesArray={personalPenalties.filter(
                                                penalty =>
                                                    penalty.date.slice(3) ===
                                                    moment(selectedDate).format(
                                                        'MM YYYY'
                                                    )
                                            )}
                                        />
                                    </Typography>
                                ) : null}
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
                    color={suspended.status ? 'primary' : 'error'}
                    variant={'contained'}
                    size={'small'}
                    onClick={() => suspendTranslator(_id)}
                    component="span"
                >
                    {suspended.status ? (
                        <FontAwesomeIcon icon={faPersonCirclePlus} />
                    ) : (
                        <FontAwesomeIcon icon={faPersonCircleXmark} />
                    )}
                </IconButton>
                <PersonalPenaltyForm
                    suspended={suspended.status}
                    id={_id}
                    addPersonalPenaltyToTranslator={
                        addPersonalPenaltyToTranslator
                    }
                />
            </CardActions>
        </Card>
    )
}
export default memo(SingleTranslator)
