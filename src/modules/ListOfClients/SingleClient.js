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
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import ClickAwayListener from '@mui/material/ClickAwayListener'
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
}) {
    const [expanded, setExpanded] = useState(false)
    const [displayMenu, setDisplayMenu] = useState(false)
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

    const currentMonth =
        moment().format('MMMM').length > '5'
            ? moment().format('MMM')
            : moment().format('MMMM')
    const previousMonth =
        moment().subtract(1, 'month').format('MMMM').length > '5'
            ? moment().subtract(1, 'month').format('MMM')
            : moment().subtract(1, 'month').format('MMMM')
    const progressPage =
        middleMonthSum >= prevousMiddleMonthSum ? (
            <span className={'green-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                {` ${monthProgressPercent} %`}
            </span>
        ) : (
            <span className={'red-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleDown} />
                {` ${monthProgressPercent} %`}
            </span>
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
                            {displayMenu ? (
                                <Button
                                    className="menu-button_delete"
                                    variant="contained"
                                    aria-label="delete"
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleUpdatingClientsId(_id)}
                                >
                                    Edit
                                </Button>
                            ) : null}
                        </IconButton>
                    </ClickAwayListener>
                }
            />

            <CardContent>
                <Typography variant="h5" component="div">
                    {`${name} ${surname}`}
                </Typography>
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
                    <b className="styled-text-numbers grid-template-container__info">{`${middleMonthSum} $`}</b>
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
