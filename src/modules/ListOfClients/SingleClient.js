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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowAltCircleUp,
    faArrowAltCircleDown,
} from '@fortawesome/free-solid-svg-icons'

export default function SingleClient({
    name,
    surname,
    currentMonthTotalAmount,
    previousMonthTotalAmount,
    middleMonthSum,
    prevousMiddleMonthSum,
    monthProgressPercent,
    translators,
    bank,
    link,
}) {
    const [expanded, setExpanded] = useState(false)

    const handleChange = e => {
        setExpanded(!expanded)
    }
    function getClientsRating() {
        const amount = currentMonthTotalAmount

        return amount >= 1000
            ? 5
            : amount >= 75
            ? 4
            : amount >= 50
            ? 3
            : amount >= 30
            ? 2
            : 1
    }

    const currentMonth = moment().format('MMMM')
    const previousMonth = moment().subtract(1, 'month').format('MMMM')
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
                        {bank}
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
                style={{ display: 'grid', gridTemplateColumns: '40px auto' }}
            >
                <Typography align={'left'}>
                    <Link variant="button" href={link} underline="none">
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
                            Passwords
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography
                            variant="body2"
                            align={'left'}
                            className="grid-template-container"
                        >
                            <span className="grid-template-container__title">
                                Svadba.com:
                            </span>
                            <span className="grid-template-container__card">
                                P@42DC2B
                            </span>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </CardActions>
        </Card>
    )
}
