import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import moment from 'moment'
import InstagramIcon from '@mui/icons-material/Instagram'
import { Rating } from '@mui/material'
import Link from '@mui/material/Link'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import MenuSharpIcon from '@mui/icons-material/MenuSharp'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import { TRANSLATORS_SALARY_PERCENT } from '../../constants/constants'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowAltCircleUp,
    faArrowAltCircleDown,
} from '@fortawesome/free-solid-svg-icons'

export default function SingleClient({
    _id,
    name,
    surname,
    currentMonthTotalAmount,
    previousMonthTotalAmount,
    middleMonthSum,
    prevousMiddleMonthSum,
    monthProgressPercent,
    translators,
    bankAccount,
    instagramLink,
    handleUpdatingClientsId,
    svadba,
    dating,
    handleSwitchToGraph,
    loss,
    currentYearProfit,
}) {
    const [expanded, setExpanded] = useState(false)
    const [displayMenu, setDisplayMenu] = useState(false)
    const [displayProfit, setDisplayProfit] = useState(false)
    const [copied, setCopied] = useState(false)
    const handleChange = e => {
        setExpanded(!expanded)
    }
    function getClientsRating() {
        return middleMonthSum >= 100
            ? 5
            : middleMonthSum >= 75
            ? 4
            : middleMonthSum >= 50
            ? 3
            : middleMonthSum >= 30
            ? 2
            : 1
    }
    const payedToTranslators = Math.round(
        currentYearProfit * TRANSLATORS_SALARY_PERCENT
    )
    const clientProfit = Math.round(
        currentYearProfit - payedToTranslators - loss
    )
    const currentMonth =
        moment().format('MMMM').length > '5'
            ? moment().format('MMM')
            : moment().format('MMMM')
    const previousMonth =
        moment().subtract(1, 'month').format('MMMM').length > '5'
            ? moment().subtract(1, 'month').format('MMM')
            : moment().subtract(1, 'month').format('MMMM')
    const progressPage = (
        <div className="grid-template-container__info">
            <IconButton
                color="primary"
                variant="contained"
                size="small"
                sx={{
                    padding: 0,
                }}
                onClick={() => handleSwitchToGraph(_id)}
            >
                <QueryStatsIcon fontSize="small" />
            </IconButton>
            <span
                className={
                    middleMonthSum >= prevousMiddleMonthSum
                        ? ' green-text styled-text-numbers'
                        : ' red-text styled-text-numbers'
                }
            >
                {middleMonthSum >= prevousMiddleMonthSum ? (
                    <FontAwesomeIcon icon={faArrowAltCircleUp} />
                ) : (
                    <FontAwesomeIcon icon={faArrowAltCircleDown} />
                )}
                {` ${monthProgressPercent}%`}
            </span>
            <b> {middleMonthSum}$</b>
        </div>
    )

    return (
        <Card
            className="translator-item gradient-box"
            style={{
                minHeight: 100,
            }}
        >
            <CardHeader
                title={
                    <Rating
                        name="read-only"
                        value={getClientsRating()}
                        readOnly
                        size="small"
                    />
                }
                action={
                    <ClickAwayListener
                        onClickAway={() => setDisplayMenu(false)}
                    >
                        <IconButton
                            onClick={() => setDisplayMenu(!displayMenu)}
                            className="list-item__menu-button"
                        >
                            <MenuSharpIcon />
                            {displayMenu && (
                                <div className="list-item__menu-button__content-holder">
                                    <Button
                                        variant="contained"
                                        aria-label="delete"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() =>
                                            handleUpdatingClientsId(_id)
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                            )}
                        </IconButton>
                    </ClickAwayListener>
                }
            />

            <CardContent>
                <Typography variant="h5">{`${name} ${surname}`}</Typography>
                <Typography
                    variant="body2"
                    align={'left'}
                    className="grid-template-container"
                >
                    <span className="grid-template-container__title">
                        Total for {currentMonth}:
                    </span>
                    <b className="styled-text-numbers grid-template-container__info">{`${currentMonthTotalAmount} $`}</b>
                </Typography>
                <Typography
                    variant="body2"
                    align={'left'}
                    className="grid-template-container"
                >
                    <span className="grid-template-container__title">
                        Total for {previousMonth}:
                    </span>
                    <b className="styled-text-numbers grid-template-container__info">{`${previousMonthTotalAmount} $`}</b>
                </Typography>
                <Typography
                    variant="body2"
                    align={'left'}
                    className="grid-template-container"
                >
                    <span className="grid-template-container__title">
                        Middle for {currentMonth}:
                    </span>
                    {progressPage}
                </Typography>
                <Typography
                    variant="body2"
                    align={'left'}
                    component="div"
                    className="grid-template-container"
                >
                    <span className="grid-template-container__title">
                        Profile profit:
                    </span>
                    <ClickAwayListener
                        onClickAway={() => setDisplayProfit(false)}
                    >
                        <Box
                            className="grid-template-container__info"
                            sx={{ position: 'relative' }}
                        >
                            <Button
                                variant="text"
                                size="small"
                                sx={{
                                    padding: 0,
                                    letterSpacing: 1,
                                    color: 'black',
                                    textShadow: '1px 1px 1px rgb(0 0 0 / 20%)',
                                }}
                                startIcon={
                                    <AccountBalanceIcon
                                        sx={{
                                            color:
                                                clientProfit < 0
                                                    ? 'red'
                                                    : 'green',
                                        }}
                                    />
                                }
                                onClick={() => setDisplayProfit(!displayProfit)}
                            >
                                <b className="styled-text-numbers">
                                    {clientProfit} $
                                </b>
                            </Button>
                            {displayProfit && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        minWidth: 200,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        top: 28,
                                        right: '5px',
                                        zIndex: 1,
                                        border: '1px solid',
                                        p: 1,
                                        bgcolor: 'background.paper',
                                    }}
                                >
                                    {loss > 0 && (
                                        <span className="balance-menu_item">
                                            Client's spends:
                                            <b>{`-${loss} $`}</b>
                                        </span>
                                    )}
                                    <span className="balance-menu_item">
                                        Total profit:{' '}
                                        <b>{`${currentYearProfit} $`}</b>
                                    </span>
                                    <span className="balance-menu_item">
                                        Payed to translators:
                                        <b>{`${payedToTranslators} $`}</b>
                                    </span>
                                </Box>
                            )}
                        </Box>
                    </ClickAwayListener>
                </Typography>
                <Typography
                    variant="body2"
                    align={'left'}
                    className="grid-template-container"
                >
                    <span className="grid-template-container__title">
                        Bank account:
                    </span>
                    <span className="grid-template-container__card">
                        <IconButton
                            sx={{
                                color: copied ? 'green' : 'gray',
                            }}
                            variant="contained"
                            size="small"
                            onClick={e => {
                                setCopied(true)
                                navigator.clipboard.writeText(bankAccount)
                            }}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        {bankAccount}
                    </span>
                </Typography>
                <Typography
                    variant="body2"
                    align={'left'}
                    className="grid-template-container"
                >
                    <span className="grid-template-container__title">
                        Assigned translators:
                    </span>
                    <span
                        className="grid-template-container__card"
                        style={{ display: 'grid' }}
                    >
                        {translators.map(translator => (
                            <span key={translator} style={{ textAlign: 'end' }}>
                                {translator}
                            </span>
                        ))}
                    </span>
                </Typography>
            </CardContent>
            <CardActions
                style={{
                    display: 'grid',
                    gridTemplateColumns: '40px auto',
                }}
            >
                <Typography
                    align={'left'}
                    style={{
                        alignSelf: 'end',
                    }}
                >
                    <Link
                        variant="button"
                        href={instagramLink}
                        underline="none"
                    >
                        <InstagramIcon
                            fontSize="large"
                            sx={{ color: red[400] }}
                        />
                    </Link>
                </Typography>
                <Accordion
                    expanded={expanded}
                    onChange={handleChange}
                    className="grid-template-container__card"
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ flexShrink: 0 }}>
                            Sites Access
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography
                            variant="body2"
                            align={'left'}
                            className="grid-template-container"
                        >
                            <span className="grid-template-container__title">
                                Logins:
                            </span>
                            <span className="grid-template-container__card">
                                Passwords:
                            </span>
                        </Typography>
                        <Typography
                            variant="body2"
                            align={'left'}
                            className="grid-template-container"
                        >
                            <span className="grid-template-container__title">
                                {svadba.login}
                            </span>
                            <span className="grid-template-container__card">
                                {svadba.password}
                            </span>
                        </Typography>
                        <Typography
                            variant="body2"
                            align={'left'}
                            className="grid-template-container"
                        >
                            <span className="grid-template-container__title">
                                {dating.login}
                            </span>
                            <span className="grid-template-container__card">
                                {dating.password}
                            </span>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </CardActions>
        </Card>
    )
}
