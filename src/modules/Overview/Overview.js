import '../../styles/modules/Overview.css'
import { useSelector } from 'react-redux'
import { useOverview } from './businessLogic'
import {
    calculatePercentDifference,
    getSumFromArray,
    getMomentUTC,
} from 'sharedFunctions/sharedFunctions'
import {
    currentMonth,
    previousYear,
    previousMonth,
    arrayOfYearsForSelectFilter,
} from '../../constants/constants'
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
import { FINANCE_COMMENTS } from '../../constants/constants'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useAdminStatus } from '../../sharedHooks/useAdminStatus'
import Loader from 'sharedComponents/Loader/Loader'

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

function Overview() {
    const user = useSelector(state => state.auth.user)
    const {
        selectedYear,
        clients,
        translators,
        calculateMonthTotal,
        calculateYearTotal,
        statements,
        handleChange,
        isLoading,
    } = useOverview(user)
    const { isAdmin } = useAdminStatus(user)

    const getStatementsGroupedByCommentAndYear = statements => {
        const groupedStatement = Object.values(FINANCE_COMMENTS).map(
            comment => {
                let groupedByAmount = []
                statements.forEach(statement => {
                    if (
                        statement.comment === comment &&
                        statement.date.includes(selectedYear)
                    ) {
                        groupedByAmount.push(statement.amount)
                    }
                })
                const groupedByCommentAndAmount = {
                    comment: comment,
                    amount: groupedByAmount.reduce(
                        (sum, current) => sum + current,
                        0
                    ),
                }
                return groupedByCommentAndAmount
            }
        )
        return groupedStatement
    }

    const statementsGroupedByComment =
        getStatementsGroupedByCommentAndYear(statements)
    const yearTotalSum = calculateYearTotal()
    const monthTotalSum = calculateMonthTotal()
    const previousMonthTotal =
        previousMonth === '12'
            ? calculateMonthTotal(previousMonth, false, false, previousYear)
            : calculateMonthTotal(previousMonth, false)
    const svadbaMonthTotal = calculateMonthTotal(currentMonth, true, true)
    const svadbaPreviousMonthTotal =
        previousMonth === '12'
            ? calculateMonthTotal(previousMonth, false, true, previousYear)
            : calculateMonthTotal(previousMonth, false, true)
    const monthProgress =
        monthTotalSum > previousMonthTotal ? (
            <span className={'green-text styled-text-numbers'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                <span> </span>
                <CountUp
                    duration={0.75}
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
                    end={calculatePercentDifference(
                        svadbaMonthTotal,
                        svadbaPreviousMonthTotal
                    )}
                />
                &nbsp;%
            </span>
        )
    const totalPayments = getSumFromArray(
        statementsGroupedByComment.map(el => el.amount)
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
    const totalProfit =
        yearTotalSum - Math.floor(yearTotalSum * 0.45) - totalPayments

    return (
        <div className={'main-container  table-container  animated-box'}>
            {!isLoading && (
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell
                                    style={{
                                        fontWeight: 'bold',
                                        maxWidth: '50%',
                                    }}
                                >
                                    <div className="year-holder">
                                        <span>Statistic's type</span>
                                        <FormControl size="small">
                                            <Select
                                                id="demo-simple-select"
                                                value={selectedYear}
                                                onChange={handleChange}
                                                className="selected-area"
                                            >
                                                {arrayOfYearsForSelectFilter.map(
                                                    year => (
                                                        <MenuItem
                                                            key={year}
                                                            value={year}
                                                        >
                                                            {year}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell className="td-with-info">
                                    Data
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {selectedYear === getMomentUTC().format('YYYY') ? (
                                <>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Current month
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            {getMomentUTC().format('MMMM')}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Month balance
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            <span
                                                className={
                                                    'blue-text styled-text-numbers percents-margin'
                                                }
                                            >
                                                <CountUp
                                                    duration={0.75}
                                                    end={monthTotalSum}
                                                    separator=" "
                                                    prefix="$"
                                                />
                                            </span>
                                            {monthProgress}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Svadba balance
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            <span
                                                className={
                                                    'blue-text styled-text-numbers percents-margin'
                                                }
                                            >
                                                <CountUp
                                                    duration={0.75}
                                                    end={svadbaMonthTotal}
                                                    separator=" "
                                                    prefix="$"
                                                />
                                            </span>
                                            {svadbaMonthProgress}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Dating balance
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            <span
                                                className={
                                                    'blue-text styled-text-numbers percents-margin'
                                                }
                                            >
                                                <CountUp
                                                    duration={0.75}
                                                    end={
                                                        monthTotalSum -
                                                        svadbaMonthTotal
                                                    }
                                                    separator=" "
                                                    prefix="$"
                                                />
                                            </span>
                                            {datingMonthProgress}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Total clients
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            {clients.length}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Active translators
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            {
                                                translators.filter(
                                                    translator =>
                                                        !translator.suspended
                                                            .status
                                                ).length
                                            }
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </>
                            ) : null}

                            {isAdmin && (
                                <>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Year's balance
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            {`${yearTotalSum} $`}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Salary payed
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            <span
                                                className={
                                                    'blue-text styled-text-numbers'
                                                }
                                            >
                                                <CountUp
                                                    duration={0.75}
                                                    end={Math.floor(
                                                        yearTotalSum * 0.45
                                                    )}
                                                    separator=" "
                                                    prefix="$"
                                                />
                                            </span>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    {statementsGroupedByComment.map(
                                        statement => (
                                            <StyledTableRow
                                                key={
                                                    statement.amount +
                                                    statement.comment
                                                }
                                            >
                                                <StyledTableCell>
                                                    {statement.comment ===
                                                    'salary'
                                                        ? 'Clients Salary'
                                                        : statement.comment}
                                                </StyledTableCell>
                                                <StyledTableCell className="td-with-info">
                                                    <span
                                                        className={
                                                            'blue-text styled-text-numbers'
                                                        }
                                                    >
                                                        <CountUp
                                                            duration={0.75}
                                                            end={
                                                                statement.amount
                                                            }
                                                            separator=" "
                                                            prefix="$"
                                                        />
                                                    </span>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )
                                    )}
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Total profit
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            <span
                                                className={
                                                    'green-text styled-text-numbers'
                                                }
                                                style={{
                                                    margin: 0,
                                                }}
                                            >
                                                <CountUp
                                                    duration={0.75}
                                                    end={totalProfit}
                                                    separator=" "
                                                />{' '}
                                                $
                                            </span>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {isLoading && <Loader />}
        </div>
    )
}

export default Overview
