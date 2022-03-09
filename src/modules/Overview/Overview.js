import Menu from "../../sharedComponents/Menu/Menu";
import moment from "moment";
import "../../styles/modules/Overview.css";
import SmallLoader from "../../sharedComponents/SmallLoader/SmallLoader";
import Unauthorized from "../AuthorizationPage/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import YearSelect from "../../sharedComponents/YearSelect/YearSelect";
import { useOverview } from "./businessLogic";

function Overview() {
  const {
    progressStatus,
    handleChange,
    selectedYear,
    arrayOfYears,
    bestMonth,
    clients,
    progressValue,
    translators,
    yearSum,
  } = useOverview();

  let monthProgressPage =
    progressValue || progressValue === 0 ? (
      progressStatus ? (
        <span className={"green-text"}> + {progressValue} %</span>
      ) : (
        <span className={"red-text"}> - {progressValue} %</span>
      )
    ) : (
      <SmallLoader />
    );

  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return isSignedIn ? (
          <>
            <Menu />
            <div className={"socials button-add-container middle-button"}>
              <AccessTimeIcon />
              <YearSelect
                arrayOfYears={arrayOfYears}
                year={selectedYear}
                handleChange={handleChange}
              />
            </div>
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
                        <td>Month progress</td>
                        <td>
                          <b>{monthProgressPage}</b>
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
                        <td>Total translators</td>
                        <td>
                          <b>
                            {translators.length ? (
                              translators.length
                            ) : (
                              <SmallLoader />
                            )}
                          </b>
                        </td>
                      </tr>
                    </>
                  ) : null}

                  <tr>
                    <td>Best month of {moment(selectedYear).format("YYYY")}</td>
                    <td>
                      <b>
                        {bestMonth ? (
                          <span>
                            {`${moment(
                              `${selectedYear}-${bestMonth.month}-01`
                            ).format("MMM")} : `}
                            <b className={"green-text"}>
                              {bestMonth.values + " $"}
                            </b>
                          </span>
                        ) : (
                          <SmallLoader />
                        )}
                      </b>
                    </td>
                  </tr>

                  <tr>
                    <td>Year's balance</td>
                    <td>
                      <b>{yearSum ? yearSum + " $" : <SmallLoader />}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Salary payed</td>
                    <td>
                      <b>
                        {yearSum ? (
                          <span style={{ color: "orange" }}>
                            {" "}
                            {Math.floor(yearSum * 0.45) + " $"}{" "}
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
                        {yearSum ? (
                          <span style={{ color: "orange" }}>
                            {" "}
                            {Math.floor(yearSum * 0.1) + " $"}{" "}
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
                        {yearSum ? (
                          <span className={"green-text"}>
                            {" "}
                            {yearSum -
                              Math.floor(yearSum * 0.4) -
                              Math.floor(yearSum * 0.1) +
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
          </>
        ) : (
          <Unauthorized />
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default Overview;
