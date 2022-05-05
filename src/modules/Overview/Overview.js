import moment from "moment";
import "../../styles/modules/Overview.css";
import SmallLoader from "../../sharedComponents/SmallLoader/SmallLoader";
import Unauthorized from "../AuthorizationPage/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { useOverview } from "./businessLogic";
import { calculatePercentDifference } from "../../sharedFunctions/sharedFunctions";
import { currentMonth, previousMonth } from "../../constants/constants";

function Overview({ user }) {
  const {
    selectedYear,
    clients,
    translators,
    calculateMonthTotal,
    calculateYearTotal,
  } = useOverview(user);

  const monthProgressPage =
    calculateMonthTotal() > calculateMonthTotal(previousMonth, false) ? (
      <span className={"green-text"}>{` + ${calculatePercentDifference(
        calculateMonthTotal(),
        calculateMonthTotal(previousMonth, false)
      )} %`}</span>
    ) : (
      <span className={"red-text"}>{` - ${calculatePercentDifference(
        calculateMonthTotal(),
        calculateMonthTotal(previousMonth, false)
      )} %`}</span>
    );

  return (
    <FirebaseAuthConsumer>
      {({ user }) => {
        return user ? (
          <div
            className={
              "taskList-container chart-container table-container  animated-box"
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
                {selectedYear === moment().format("YYYY") ? (
                  <>
                    <tr>
                      <td>Current month</td>
                      <td>
                        <b>{moment().format("MMMM YYYY")}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Month balance</td>
                      <td>
                        <span className={"green-text"}>
                          <b>
                            {calculateYearTotal() ? (
                              `${calculateMonthTotal()} $`
                            ) : (
                              <SmallLoader />
                            )}
                          </b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Svadba balance</td>
                      <td>
                        <span className={"blue-text"}>
                            {calculateYearTotal() ? (
                                `${calculateMonthTotal(currentMonth, true, true)} $`
                            ) : (
                                <SmallLoader />
                            )}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Dating balance</td>
                      <td>
                        <span className={"blue-text"}>
                            {calculateYearTotal() ? (
                                `${calculateMonthTotal() - calculateMonthTotal(currentMonth, true, true)} $`
                            ) : (
                                <SmallLoader />
                            )}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Month progress</td>
                      <td>
                        {calculateMonthTotal() ? (
                          monthProgressPage
                        ) : (
                          <SmallLoader />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Total clients</td>
                      <td>
                        <b>
                          {clients.length ? clients.length : <SmallLoader />}
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td>Active translators</td>
                      <td>
                        <b>
                          {translators.length ? (
                            translators.filter(translator => !translator.suspended.status).length
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
                        calculateYearTotal() + " $"
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
                        <span style={{ color: "orange" }}>
                          {" "}
                          {Math.floor(calculateYearTotal() * 0.45) + " $"}{" "}
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
                        <span style={{ color: "orange" }}>
                          {" "}
                          {Math.floor(calculateYearTotal() * 0.1) + " $"}{" "}
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
                        <span className={"green-text"}>
                          {" "}
                          {calculateYearTotal() -
                            Math.floor(calculateYearTotal() * 0.4) -
                            Math.floor(calculateYearTotal() * 0.1) +
                            " $"}{" "}
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
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default Overview;
