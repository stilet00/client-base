import React from 'react'
import EditBalanceForm from '../EditBalanceForm/EditBalanceForm'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import {
    TRANSLATORS_SALARY_PERCENT,
    PAYONEER_COMISSION,
} from '../../../constants/constants'
import moment from 'moment'
import { useSingleTranslator } from '../businessLogic'
import {
    calculatePercentDifference,
    calculateTranslatorMonthTotal,
    calculateBalanceDaySum,
    getSumFromArray,
    getStartOfPreviousDayInUTC,
} from 'sharedFunctions/sharedFunctions'
import { currentYear, previousDay } from '../../../constants/constants'
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
import LoadingButton from '@mui/lab/LoadingButton'
import RedeemIcon from '@mui/icons-material/Redeem'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import Loader from 'sharedComponents/Loader/Loader'

const getTranslatorSalaryInUah = (dollarToUahRate, salary = 100) => {
    const currentCurrencyRate = dollarToUahRate
        ? Number(dollarToUahRate).toFixed(2)
        : 0
    const salaryInUahIncludingComissinos =
        currentCurrencyRate * PAYONEER_COMISSION * salary
    return salaryInUahIncludingComissinos
}

function SingleTranslator({
    name,
    surname,
    clients,
    _id,
    dragOverHandler,
    onBoardDrop,
    dragLeaveHandler,
    suspendTranslator,
    suspended,
    suspendClient,
    personalPenalties,
    email,
    updateTranslatorEmail,
    wantsToReceiveEmails,
    dollarToUahRate,
    admin,
    updateBalanceDayIsLoading,
}) {
    const {
        calculateSumByClient,
        specialColorNeeded,
        getTranslatorsRating,
        calculateMiddleMonthSum,
        calculatePersonalPenalties,
        getLastVirtualGiftDate,
        lastVirtualGiftLabel,
        giftRequestLoader,
        balanceDaysAreLoading,
        translatorBalanceDays,
    } = useSingleTranslator({
        translatorId: _id,
        personalPenalties,
    })
    const translatorMonthTotalSum = calculateTranslatorMonthTotal(
        translatorBalanceDays
    )
    const previousDayDate = getStartOfPreviousDayInUTC()
    const translatorBalanceDaysForPreviousMonth = translatorBalanceDays.filter(
        ({ dateTimeId }) =>
            moment(dateTimeId).isSame(
                moment().utc().subtract(1, 'month'),
                'month'
            )
    )
    const translatorPreviousMonthTotalSum = calculateTranslatorMonthTotal(
        translatorBalanceDaysForPreviousMonth,
        true
    )
    const translatorSalaryForPreviousMonth = Math.floor(
        translatorPreviousMonthTotalSum * TRANSLATORS_SALARY_PERCENT
    )

    const translatorSalaryForPreviousMonthInUah = Math.floor(
        getTranslatorSalaryInUah(
            dollarToUahRate,
            translatorSalaryForPreviousMonth
        )
    )

    let progressPage = null

    if (!!translatorMonthTotalSum && !!translatorPreviousMonthTotalSum) {
        progressPage =
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
    }

    const monthStringFormat =
        moment(previousDayDate).format('MMMM').length > '5' ? 'MMM' : 'MMMM'
    const currentMonth = moment(previousDayDate).format(monthStringFormat)
    const previousMonth = moment()
        .subtract(1, 'month')
        .format(monthStringFormat)
    const balanceDaysForSelectedDate = translatorBalanceDays.filter(
        ({ dateTimeId }) => moment(dateTimeId).isSame(previousDayDate, 'day')
    )
    const isValidVirtualGiftDate = moment(
        lastVirtualGiftLabel,
        '',
        true
    ).isValid()
    const personalPenaltiesObject = calculatePersonalPenalties()
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
                {!balanceDaysAreLoading && (
                    <Rating
                        name="read-only"
                        value={getTranslatorsRating()}
                        readOnly
                        size="small"
                    />
                )}
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
                            <b>
                                {moment(suspended.time).format(
                                    'YYYY/MM/DD HH:mm [UTC]'
                                )}
                            </b>
                        </Typography>
                    ) : null}
                    {balanceDaysAreLoading && <Loader />}
                    {!balanceDaysAreLoading && (
                        <>
                            {translatorBalanceDays.length > 0 && (
                                <>
                                    <Typography
                                        variant="body2"
                                        align={'left'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>Total for {currentMonth}:</span>
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
                                        <b>{`${calculateMiddleMonthSum(
                                            previousDayDate
                                        )} $ `}</b>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        align={'left'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {`For ${previousDayDate.format(
                                            'MM/DD/YYYY'
                                        )}: `}
                                        {!!balanceDaysForSelectedDate.length >
                                        0 ? (
                                            <b className="styled-text-numbers">
                                                {`${getSumFromArray(
                                                    balanceDaysForSelectedDate.map(
                                                        balanceDay =>
                                                            calculateBalanceDaySum(
                                                                balanceDay.statistics
                                                            )
                                                    )
                                                )} $`}
                                            </b>
                                        ) : (
                                            <b>{`No data`}</b>
                                        )}
                                    </Typography>
                                    {admin && (
                                        <>
                                            <Typography
                                                variant="body2"
                                                align="left"
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                {`Salary for ${previousMonth}: `}
                                                <b>{`${translatorSalaryForPreviousMonth} $`}</b>
                                            </Typography>
                                            {dollarToUahRate ? (
                                                <Typography
                                                    variant="body2"
                                                    align="left"
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between',
                                                    }}
                                                >
                                                    {`Salary for ${previousMonth} in UAH: `}
                                                    <b>{`${translatorSalaryForPreviousMonthInUah} ₴`}</b>
                                                </Typography>
                                            ) : null}
                                        </>
                                    )}
                                    {personalPenaltiesObject
                                        ?.selectedDatePenaltiesArray?.length >
                                        0 && (
                                        <Typography
                                            variant="body2"
                                            align={'left'}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            Penalties for{' '}
                                            {`${previousDayDate.format(
                                                'MMMM'
                                            )}: `}
                                            <PenaltiesList
                                                penaltiesArray={
                                                    personalPenaltiesObject.selectedDatePenaltiesArray
                                                }
                                            />
                                        </Typography>
                                    )}
                                    {personalPenaltiesObject
                                        ?.thisMonthsPenaltiesArray?.length >
                                        0 && (
                                        <Typography
                                            variant="body2"
                                            align={'left'}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            Penalties for{' '}
                                            {`${moment().format('MMMM')}: `}
                                            <PenaltiesList
                                                penaltiesArray={
                                                    personalPenaltiesObject.thisMonthsPenaltiesArray
                                                }
                                            />
                                        </Typography>
                                    )}
                                </>
                            )}
                            {translatorBalanceDays.length === 0 && (
                                <Typography variant="body2">
                                    {`No data for ${currentMonth} yet`}
                                </Typography>
                            )}
                            {suspended.status ? null : (
                                <>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>
                                                Active clients
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ul
                                                className={'clients-list'}
                                                id={_id}
                                                onDragOver={dragOverHandler}
                                                onDragLeave={dragLeaveHandler}
                                                onDrop={e =>
                                                    onBoardDrop(e, _id)
                                                }
                                            >
                                                {clients.filter(
                                                    client => !client.suspended
                                                ).length ? (
                                                    clients
                                                        .filter(
                                                            client =>
                                                                !client.suspended
                                                        )
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
                                                                <Typography variant="caption">
                                                                    {`Balance for ${moment(
                                                                        `${previousDay}/${currentMonth}/${currentYear}`,
                                                                        `D/${monthStringFormat}/YYYY`
                                                                    ).format(
                                                                        'DD MMMM'
                                                                    )}:`}
                                                                </Typography>
                                                                <li
                                                                    className={
                                                                        'clients-list__name-container'
                                                                    }
                                                                    id={
                                                                        client._id
                                                                    }
                                                                >
                                                                    <p>
                                                                        {`${client.name} ${client.surname}`}
                                                                    </p>
                                                                    {admin && (
                                                                        <IconButton
                                                                            color={
                                                                                'primary'
                                                                            }
                                                                            variant={
                                                                                'contained'
                                                                            }
                                                                            size={
                                                                                'small'
                                                                            }
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
                                                                    )}
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
                                                                        >
                                                                            {`${calculateSumByClient(
                                                                                client._id
                                                                            )} $`}
                                                                        </b>
                                                                    </li>
                                                                ) : (
                                                                    <li
                                                                        className={
                                                                            'clients-list__finance-container'
                                                                        }
                                                                    >
                                                                        {`No balance for yesterday`}
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
                                    {clients.filter(client => client.suspended)
                                        .length ? (
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header-2"
                                            >
                                                <Typography>
                                                    Suspended clients
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <ul
                                                    className={'clients-list'}
                                                    id={_id}
                                                >
                                                    {clients
                                                        .filter(
                                                            client =>
                                                                client.suspended
                                                        )
                                                        .map(client => (
                                                            <li
                                                                className={
                                                                    'clients-list__name-container'
                                                                }
                                                                id={client._id}
                                                                key={client._id}
                                                            >
                                                                <p>{`${client.name} ${client.surname}`}</p>
                                                                {admin && (
                                                                    <IconButton
                                                                        color={
                                                                            'success'
                                                                        }
                                                                        variant={
                                                                            'contained'
                                                                        }
                                                                        size={
                                                                            'small'
                                                                        }
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
                                                                )}
                                                            </li>
                                                        ))}
                                                </ul>
                                            </AccordionDetails>
                                        </Accordion>
                                    ) : null}
                                    <LoadingButton
                                        size="small"
                                        sx={{
                                            height: 48,
                                            borderColor: '#fff',
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            width: '100%',
                                            transition:
                                                'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                            backgroundColor: '#fff',
                                            boxShadow:
                                                '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                                            marginTop: '12px',
                                            '&:hover': {
                                                backgroundColor: '#fff',
                                                borderColor:
                                                    'rgba(0, 0, 0, 0.87)',
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor:
                                                    'rgba(0, 0, 0, 0.7)',
                                                color: 'rgb(224,224,224)',
                                                '&:hover': {
                                                    backgroundColor:
                                                        'rgba(0, 0, 0, 0.7)',
                                                },
                                            },
                                        }}
                                        onClick={e =>
                                            getLastVirtualGiftDate(_id)
                                        }
                                        disabled={
                                            lastVirtualGiftLabel !==
                                            `Last virtual gift was at:`
                                        }
                                        endIcon={
                                            lastVirtualGiftLabel ===
                                            'No gifts found' ? (
                                                <SentimentVeryDissatisfiedIcon />
                                            ) : (
                                                <RedeemIcon />
                                            )
                                        }
                                        loading={giftRequestLoader}
                                        loadingPosition="end"
                                        variant="outlined"
                                    >
                                        {isValidVirtualGiftDate
                                            ? moment(
                                                  lastVirtualGiftLabel
                                              ).format(`MM DD YYYY`)
                                            : lastVirtualGiftLabel}
                                    </LoadingButton>
                                </>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
            <CardActions>
                {clients?.length &&
                !suspended.status &&
                !balanceDaysAreLoading ? (
                    <EditBalanceForm
                        updateBalanceDayIsLoading={updateBalanceDayIsLoading}
                        translatorId={_id}
                        name={name}
                        surname={surname}
                        clients={clients}
                        admin={admin}
                    />
                ) : null}
                <IconButton
                    color={suspended.status ? 'primary' : 'error'}
                    variant={'contained'}
                    size={'small'}
                    onClick={() => suspendTranslator(_id)}
                    disabled={!admin}
                    component="span"
                >
                    {suspended.status ? (
                        <FontAwesomeIcon icon={faPersonCirclePlus} />
                    ) : (
                        <FontAwesomeIcon icon={faPersonCircleXmark} />
                    )}
                </IconButton>
                {admin && (
                    <PersonalPenaltyForm
                        suspended={suspended.status}
                        id={_id}
                    />
                )}
            </CardActions>
        </Card>
    )
}
export default SingleTranslator
