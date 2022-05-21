import moment from 'moment'
import '../../styles/modules/Overview.css'
import SmallLoader from '../../sharedComponents/SmallLoader/SmallLoader'
import Unauthorized from '../AuthorizationPage/Unauthorized/Unauthorized'
import { FirebaseAuthConsumer } from '@react-firebase/auth'
import { useOverview } from './businessLogic'
import { calculatePercentDifference } from '../../sharedFunctions/sharedFunctions'
import { currentMonth, previousMonth } from '../../constants/constants'

function Overview({ user }) {
    const {
        selectedYear,
        clients,
        translators,
        calculateMonthTotal,
        calculateYearTotal,
    } = useOverview(user)

    const monthProgress =
        calculateMonthTotal() > calculateMonthTotal(previousMonth, false) ? (
            <span className={'green-text'}>{` + ${calculatePercentDifference(
                calculateMonthTotal(),
                calculateMonthTotal(previousMonth, false)
            )} %`}</span>
        ) : (
            <span className={'red-text'}>{` - ${calculatePercentDifference(
                calculateMonthTotal(),
                calculateMonthTotal(previousMonth, false)
            )} %`}</span>
        )
    const svadbaMonthProgress =
        calculateMonthTotal(currentMonth, true, true) >
        calculateMonthTotal(previousMonth, false, true) ? (
            <span className={'green-text'}>{` + ${calculatePercentDifference(
                calculateMonthTotal(currentMonth, true, true),
                calculateMonthTotal(previousMonth, false, true)
            )} %`}</span>
        ) : (
            <span className={'red-text'}>{` - ${calculatePercentDifference(
                calculateMonthTotal(currentMonth, true, true),
                calculateMonthTotal(previousMonth, false, true)
            )} %`}</span>
        )
    const datingMonthProgress =
        calculateMonthTotal() - calculateMonthTotal(currentMonth, true, true) >
        calculateMonthTotal(previousMonth, false) -
            calculateMonthTotal(previousMonth, false, true) ? (
            <span className={'green-text'}>
                {` + ${calculatePercentDifference(
                    calculateMonthTotal() -
                        calculateMonthTotal(currentMonth, true, true),
                    calculateMonthTotal(previousMonth, false) -
                        calculateMonthTotal(previousMonth, false, true)
                )} %`}
            </span>
        ) : (
            <span className={'red-text'}>
                {` - ${calculatePercentDifference(
                    calculateMonthTotal() -
                        calculateMonthTotal(currentMonth, true, true),
                    calculateMonthTotal(previousMonth, false) -
                        calculateMonthTotal(previousMonth, false, true)
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
                                                {calculateYearTotal() ? (
                                                    <>
                                                        <span
                                                            className={
                                                                'blue-text'
                                                            }
                                                        >
                                                            <b>
                                                                {`${calculateMonthTotal()} $`}
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
                                                {calculateYearTotal() ? (
                                                    <>
                                                        <span
                                                            className={
                                                                'blue-text'
                                                            }
                                                        >
                                                            {`${calculateMonthTotal(
                                                                currentMonth,
                                                                true,
                                                                true
                                                            )} $`}
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
                                                {calculateYearTotal() ? (
                                                    <>
                                                        <span
                                                            className={
                                                                'blue-text'
                                                            }
                                                        >
                                                            {`${
                                                                calculateMonthTotal() -
                                                                calculateMonthTotal(
                                                                    currentMonth,
                                                                    true,
                                                                    true
                                                                )
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
                                            {calculateYearTotal() ? (
                                                calculateYearTotal() + ' $'
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
                                            {calculateYearTotal() ? (
                                                <span className={'blue-text'}>
                                                    {' '}
                                                    {Math.floor(
                                                        calculateYearTotal() *
                                                            0.45
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
                                            {calculateYearTotal() ? (
                                                <span className={'blue-text'}>
                                                    {' '}
                                                    {Math.floor(
                                                        calculateYearTotal() *
                                                            0.1
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
                                            {calculateYearTotal() ? (
                                                <span className={'green-text'}>
                                                    {' '}
                                                    {calculateYearTotal() -
                                                        Math.floor(
                                                            calculateYearTotal() *
                                                                0.4
                                                        ) -
                                                        Math.floor(
                                                            calculateYearTotal() *
                                                                0.1
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
