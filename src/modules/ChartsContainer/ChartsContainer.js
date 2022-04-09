import Menu from "../../sharedComponents/Navigation/Navigation";
import SingleChart from "./SingleChart/SingleChart";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ChartForm from "./ChartForm/ChartForm";
import Loader from "../../sharedComponents/Loader/Loader";
import Unauthorized from "../AuthorizationPage/Unauthorized/Unauthorized";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import AlertMessageConfirmation from "../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation";
import moment from "moment";
import YearSelect from "../../sharedComponents/YearSelect/YearSelect";
import { useChartsContainer } from "./businessLogic";

function ChartsContainer({ user }) {
  const {
    arrayOfYears,
    closeAlert,
    alertOpen,
    alertStatusConfirmation,
    cancelDeleteGraphClicked,
    closeAlertConfirmationNoReload,
    deletedMonth,
    deleteGraph,
    deleteGraphClicked,
    emptyStatus,
    handleChange,
    months,
    onMonthSubmit,
    onValueSubmit,
    openAlertConfirmation,
    selectedYear,
  } = useChartsContainer(user);

  return user ? (
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
      <div className={"taskList-container chart-container animated-box"}>
        {months.length > 0 ? (
          <ul>
            {months.map((month, index) => (
              <SingleChart
                onValueSubmit={onValueSubmit}
                graph={month}
                index={index}
                key={month._id}
                deleteGraph={deleteGraph}
              />
            ))}
          </ul>
        ) : emptyStatus ? (
          <h1> No data available. </h1>
        ) : (
          <Loader />
        )}
      </div>
      <div className={"socials button-add-container resized-container"}>
        <ChartForm onMonthSubmit={onMonthSubmit} year={selectedYear} />
      </div>
      <AlertMessage
        mainText={"Data has been added!"}
        open={alertOpen}
        handleClose={closeAlert}
        status={true}
      />
      <AlertMessageConfirmation
        mainText={"Please confirm that you want to delete chart?"}
        additionalText={
          deletedMonth
            ? `Deleting month: ${moment(
                `${deletedMonth.year}-${deletedMonth.month}`
              ).format("MMMM-YYYY")}`
            : null
        }
        open={alertStatusConfirmation}
        handleClose={closeAlertConfirmationNoReload}
        handleOpen={openAlertConfirmation}
        status={false}
        onCancel={cancelDeleteGraphClicked}
        onConfirm={deleteGraphClicked}
      />
    </>
  ) : (
    <Unauthorized />
  );
}

export default ChartsContainer;
