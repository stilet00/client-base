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
            <span className={'green-text'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                {` ${calculatePercentDifference(
                    monthTotalSum,
                    previousMonthTotal
                )} %`}
            </span>
        ) : (
            <span className={'red-text'}>
                <FontAwesomeIcon icon={faArrowAltCircleDown} />
                {` ${calculatePercentDifference(
                    monthTotalSum,
                    previousMonthTotal
                )} %`}
            </span>
        )
    const svadbaMonthProgress =
        svadbaMonthTotal > svadbaPreviousMonthTotal ? (
            <span className={'green-text'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                {` ${calculatePercentDifference(
                    svadbaMonthTotal,
                    svadbaPreviousMonthTotal
                )} %`}
            </span>
        ) : (
            <span className={'red-text'}>
                <FontAwesomeIcon icon={faArrowAltCircleDown} />
                {` ${calculatePercentDifference(
                    svadbaMonthTotal,
                    svadbaPreviousMonthTotal
                )} %`}
            </span>
        )
    const datingMonthProgress =
        monthTotalSum - svadbaMonthTotal >
        previousMonthTotal - svadbaPreviousMonthTotal ? (
            <span className={'green-text'}>
                <FontAwesomeIcon icon={faArrowAltCircleUp} />
                {` ${calculatePercentDifference(
                    monthTotalSum - svadbaMonthTotal,
                    previousMonthTotal - svadbaPreviousMonthTotal
                )} %`}
            </span>
        ) : (
            <span className={'red-text'}>
                <FontAwesomeIcon icon={faArrowAltCircleDown} />
                {` ${calculatePercentDifference(
                    monthTotalSum - svadbaMonthTotal,
                    previousMonthTotal - svadbaPreviousMonthTotal
                )} %`}
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
                        <table>
                            <thead>
                                <tr>
                                    <th>Statistic's type</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedYear === moment().format('YYYY') ? (
                                    <>
                                        <tr>
                                            <td>Current month</td>
                                            <td>
                                                <b>
                                                    {moment().format(
                                                        'MMMM YYYY'
                                                    )}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Month balance</td>
                                            <td>
                                                {yearTotalSum ? (
                                                    <>
                                                        <span
                                                            className={
                                                                'blue-text'
                                                            }
                                                        >
                                                            <b>
                                                                {`${monthTotalSum} $`}
                                                            </b>
                                                        </span>
                                                        {monthProgress}
                                                    </>
                                                ) : (
                                                    <SmallLoader />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Svadba balance</td>
                                            <td>
                                                {yearTotalSum ? (
                                                    <>
                                                        <span
                                                            className={
                                                                'blue-text'
                                                            }
                                                        >
                                                            {`${svadbaMonthTotal} $`}
                                                        </span>
                                                        {svadbaMonthProgress}
                                                    </>
                                                ) : (
                                                    <SmallLoader />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Dating balance</td>
                                            <td>
                                                {yearTotalSum ? (
                                                    <>
                                                        <span
                                                            className={
                                                                'blue-text'
                                                            }
                                                        >
                                                            {`${
                                                                monthTotalSum -
                                                                svadbaMonthTotal
                                                            } $`}
                                                        </span>

                                                        {datingMonthProgress}
                                                    </>
                                                ) : (
                                                    <SmallLoader />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Total clients</td>
                                            <td>
                                                <b>
                                                    {clients.length ? (
                                                        clients.length
                                                    ) : (
                                                        <SmallLoader />
                                                    )}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Active translators</td>
                                            <td>
                                                <b>
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
                                                </b>
                                            </td>
                                        </tr>
                                    </>
                                ) : null}

                                {/*<tr>*/}
                                {/*  <td>Best month of {moment(selectedYear).format("YYYY")}</td>*/}
                                {/*  <td>*/}
                                {/*    <b>*/}
                                {/*      {bestMonth ? (*/}
                                {/*        <span>*/}
                                {/*          {`${moment(*/}
                                {/*            `${selectedYear}-${bestMonth.month}-01`*/}
                                {/*          ).format("MMM")} : `}*/}
                                {/*          <b className={"green-text"}>*/}
                                {/*            {bestMonth.values + " $"}*/}
                                {/*          </b>*/}
                                {/*        </span>*/}
                                {/*      ) : (*/}
                                {/*        <SmallLoader />*/}
                                {/*      )}*/}
                                {/*    </b>*/}
                                {/*  </td>*/}
                                {/*</tr>*/}

                                <tr>
                                    <td>Year's balance</td>
                                    <td>
                                        <b>
                                            {yearTotalSum ? (
                                                yearTotalSum + ' $'
                                            ) : (
                                                <SmallLoader />
                                            )}
                                        </b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Salary payed</td>
                                    <td>
                                        <b>
                                            {yearTotalSum ? (
                                                <span className={'blue-text'}>
                                                    {' '}
                                                    {Math.floor(
                                                        yearTotalSum * 0.45
                                                    ) + ' $'}{' '}
                                                </span>
                                            ) : (
                                                <SmallLoader />
                                            )}
                                        </b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Payments to clients</td>
                                    <td>
                                        <b>
                                            {yearTotalSum ? (
                                                <span className={'blue-text'}>
                                                    {' '}
                                                    {Math.floor(
                                                        yearTotalSum * 0.1
                                                    ) + ' $'}{' '}
                                                </span>
                                            ) : (
                                                <SmallLoader />
                                            )}
                                        </b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Total profit</td>
                                    <td>
                                        <b>
                                            {yearTotalSum ? (
                                                <span className={'green-text'}>
                                                    {' '}
                                                    {yearTotalSum -
                                                        Math.floor(
                                                            yearTotalSum * 0.4
                                                        ) -
                                                        Math.floor(
                                                            yearTotalSum * 0.1
                                                        ) +
                                                        ' $'}{' '}
                                                </span>
                                            ) : (
                                                <SmallLoader />
                                            )}
                                        </b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Unauthorized />
                )
            }}
        </FirebaseAuthConsumer>
    )
}

export default Overview
