import moment from 'moment'
import '../../styles/modules/Overview.css'
import SmallLoader from '../../sharedComponents/SmallLoader/SmallLoader'
import Unauthorized from '../AuthorizationPage/Unauthorized/Unauthorized'
import { FirebaseAuthConsumer } from '@react-firebase/auth'
import { useOverview } from './businessLogic'
import {
    calculatePercentDifference,
    getSumFromArray,
} from '../../sharedFunctions/sharedFunctions'
import {
    currentMonth,
    previousYear,
    previousMonth,
    arrayOfSelectedYears,
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
        statements,
        handleChange,
    } = useOverview(user)

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

    return (
        <FirebaseAuthConsumer>
            {({ user }) => {
                return user ? (
                    <div
                        className={
                            'main-container  table-container  animated-box'
                        }
                    >
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
                                                        {arrayOfSelectedYears.map(
                                                            year => (
                                                                <MenuItem
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
                                    {selectedYear ===
                                    moment().format('YYYY') ? (
                                        <>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    Current month
                                                </StyledTableCell>
                                                <StyledTableCell className="td-with-info">
                                                    {moment().format('MMMM')}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    Month balance
                                                </StyledTableCell>
                                                <StyledTableCell className="td-with-info">
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
                                                <StyledTableCell className="td-with-info">
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
                                                <StyledTableCell className="td-with-info">
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
                                                <StyledTableCell className="td-with-info">
                                                    {clients.length ? (
                                                        clients.length
                                                    ) : (
                                                        <SmallLoader />
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    Active translators
                                                </StyledTableCell>
                                                <StyledTableCell className="td-with-info">
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
                                        <StyledTableCell className="td-with-info">
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
                                        <StyledTableCell className="td-with-info">
                                            {yearTotalSum ? (
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
                                            ) : (
                                                <SmallLoader />
                                            )}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    {statementsGroupedByComment.length > 0
                                        ? statementsGroupedByComment.map(
                                              statement => (
                                                  <StyledTableRow>
                                                      <StyledTableCell>
                                                          {statement.comment ===
                                                          'salary'
                                                              ? 'Clients Salary'
                                                              : statement.comment}
                                                      </StyledTableCell>
                                                      <StyledTableCell className="td-with-info">
                                                          {yearTotalSum ? (
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
                                                                          statement.amount
                                                                      }
                                                                      separator=" "
                                                                      prefix="$"
                                                                  />
                                                              </span>
                                                          ) : (
                                                              <SmallLoader />
                                                          )}
                                                      </StyledTableCell>
                                                  </StyledTableRow>
                                              )
                                          )
                                        : null}
                                    <StyledTableRow>
                                        <StyledTableCell>
                                            Total profit
                                        </StyledTableCell>
                                        <StyledTableCell className="td-with-info">
                                            <b>
                                                {(
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
                                                                    0.45
                                                            ) -
                                                            totalPayments +
                                                            ' $'}{' '}
                                                    </span>
                                                ) ?? <SmallLoader />}
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
