import moment from 'moment'
import '../../styles/modules/Overview.css'
import SmallLoader from '../../sharedComponents/SmallLoader/SmallLoader'
import Unauthorized from '../AuthorizationPage/Unauthorized/Unauthorized'
import { FirebaseAuthConsumer } from '@react-firebase/auth'
import { useOverview } from './businessLogic'
import { calculatePercentDifference } from '../../sharedFunctions/sharedFunctions'
import { currentMonth, previousMonth } from '../../constants/constants'
import {
    faArrowAltCircleUp,
    faArrowAltCircleDown,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CountUp from 'react-countup'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}))

function Overview({ user }) {
    const {
        selectedYear,
        clients,
        translators,
        calculateMonthTotal,
        calculateYearTotal,
    } = useOverview(user)

    const yearTotalSum = calculateYearTotal()
    const monthTotalSum = calculateMonthTotal()
    const previousMonthTotal = calculateMonthTotal(previousMonth, false)
    const svadbaMonthTotal = calculateMonthTotal(currentMonth, true, true)
    const svadbaPreviousMonthTotal = calculateMonthTotal(
        previousMonth,
        false,
        true
    )

    const monthProgress =
        monthTotalSum > previousMonthTotal ? (
            <span className={'green-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                <span> </span>
                <CountUp
                    duration={0.75}
                    delay={2}
                    end={calculatePercentDifference(
                        monthTotalSum,
                        previousMonthTotal
                    )}
                />
                &nbsp;%
            </span>
        ) : (
            <span className={'red-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleDown} />
                <span> </span>
                <CountUp
                    duration={0.75}
                    delay={2}
                    end={calculatePercentDifference(
                        monthTotalSum,
                        previousMonthTotal
                    )}
                />
                &nbsp;%
            </span>
        )
    const svadbaMonthProgress =
        svadbaMonthTotal > svadbaPreviousMonthTotal ? (
            <span className={'green-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                <span> </span>
                <CountUp
                    duration={0.75}
                    delay={1}
                    end={calculatePercentDifference(
                        svadbaMonthTotal,
                        svadbaPreviousMonthTotal
                    )}
                />
                &nbsp;%
            </span>
        ) : (
            <span className={'red-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleDown} />
                <span> </span>
                <CountUp
                    duration={0.75}
                    delay={1}
                    end={calculatePercentDifference(
                        svadbaMonthTotal,
                        svadbaPreviousMonthTotal
                    )}
                />
                &nbsp;%
            </span>
        )
    const datingMonthProgress =
        monthTotalSum - svadbaMonthTotal >
        previousMonthTotal - svadbaPreviousMonthTotal ? (
            <span className={'green-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                <span> </span>
                <CountUp
                    duration={0.75}
                    end={calculatePercentDifference(
                        monthTotalSum - svadbaMonthTotal,
                        previousMonthTotal - svadbaPreviousMonthTotal
                    )}
                />
                &nbsp;%
            </span>
        ) : (
            <span className={'red-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleDown} />
                <span> </span>
                <CountUp
                    duration={0.75}
                    end={calculatePercentDifference(
                        monthTotalSum - svadbaMonthTotal,
                        previousMonthTotal - svadbaPreviousMonthTotal
                    )}
                />
                &nbsp;%
            </span>
        )
    return (
        <FirebaseAuthConsumer>
            {({ user }) => {
                return user ? (
                    <div
                        className={
                            'taskList-container chart-container table-container  animated-box'
                        }
                    >
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell
                                            style={{ fontWeight: 'bold' }}
                                        >
                                            Statistic's type
                                        </StyledTableCell>
                                        <StyledTableCell
                                            style={{ fontWeight: 'bold' }}
                                        >
                                            Data
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedYear ===
                                    moment().format('YYYY') ? (
                                        <>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    Current month
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <b>
                                                        {moment().format(
                                                            'MMMM YYYY'
                                                        )}
                                                    </b>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    Month balance
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {yearTotalSum ? (
                                                        <>
                                                            <span
                                                                className={
                                                                    'blue-text styled-text-numbers'
                                                                }
                                                            >
                                                                <CountUp
                                                                    duration={
                                                                        0.75
                                                                    }
                                                                    delay={2}
                                                                    end={
                                                                        monthTotalSum
                                                                    }
                                                                    separator=" "
                                                                    prefix="$"
                                                                />
                                                            </span>
                                                            {monthProgress}
                                                        </>
                                                    ) : (
                                                        <SmallLoader />
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    Svadba balance
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {yearTotalSum ? (
                                                        <>
                                                            <span
                                                                className={
                                                                    'blue-text styled-text-numbers'
                                                                }
                                                            >
                                                                <CountUp
                                                                    duration={
                                                                        0.75
                                                                    }
                                                                    delay={1}
                                                                    end={
                                                                        svadbaMonthTotal
                                                                    }
                                                                    separator=" "
                                                                    prefix="$"
                                                                />
                                                            </span>
                                                            {
                                                                svadbaMonthProgress
                                                            }
                                                        </>
                                                    ) : (
                                                        <SmallLoader />
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    Dating balance
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {yearTotalSum ? (
                                                        <>
                                                            <span
                                                                className={
                                                                    'blue-text styled-text-numbers'
                                                                }
                                                            >
                                                                <CountUp
                                                                    duration={
                                                                        0.75
                                                                    }
                                                                    end={
                                                                        monthTotalSum -
                                                                        svadbaMonthTotal
                                                                    }
                                                                    separator=" "
                                                                    prefix="$"
                                                                />
                                                            </span>

                                                            {
                                                                datingMonthProgress
                                                            }
                                                        </>
                                                    ) : (
                                                        <SmallLoader />
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    Total clients
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <b>
                                                        {clients.length ? (
                                                            clients.length
                                                        ) : (
                                                            <SmallLoader />
                                                        )}
                                                    </b>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    Active translators
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {translators.length ? (
                                                        translators.filter(
                                                            translator =>
                                                                !translator
                                                                    .suspended
                                                                    .status
                                                        ).length
                                                    ) : (
                                                        <SmallLoader />
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        </>
                                    ) : null}

                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Year's balance
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {yearTotalSum ? (
                                                yearTotalSum + ' $'
                                            ) : (
                                                <SmallLoader />
                                            )}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Salary payed
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {yearTotalSum ? (
                                                <span
                                                    className={
                                                        'blue-text styled-text-numbers'
                                                    }
                                                >
                                                    {' '}
                                                    {Math.floor(
                                                        yearTotalSum * 0.45
                                                    ) + ' $'}{' '}
                                                </span>
                                            ) : (
                                                <SmallLoader />
                                            )}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Payments to clients
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {yearTotalSum ? (
                                                <span
                                                    className={
                                                        'blue-text styled-text-numbers'
                                                    }
                                                >
                                                    {' '}
                                                    {Math.floor(
                                                        yearTotalSum * 0.1
                                                    ) + ' $'}{' '}
                                                </span>
                                            ) : (
                                                <SmallLoader />
                                            )}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Total profit
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <b>
                                                {yearTotalSum ? (
                                                    <span
                                                        className={
                                                            'green-text styled-text-numbers'
                                                        }
                                                        style={{
                                                            margin: 0,
                                                        }}
                                                    >
                                                        {' '}
                                                        {yearTotalSum -
                                                            Math.floor(
                                                                yearTotalSum *
                                                                    0.4
                                                            ) -
                                                            Math.floor(
                                                                yearTotalSum *
                                                                    0.1
                                                            ) +
                                                            ' $'}{' '}
                                                    </span>
                                                ) : (
                                                    <SmallLoader />
                                                )}
                                            </b>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ) : (
                    <Unauthorized />
                )
            }}
        </FirebaseAuthConsumer>
    )
}

export default Overview
