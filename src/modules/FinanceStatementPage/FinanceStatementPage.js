import { useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/modules/FinanceStatementPage.css";
import PaymentsGroup from "./PaymentsGroup/PaymentsGroup";
import FinancesForm from "./FinancesForm/FinancesForm";
import Loader from "../../sharedComponents/Loader/Loader";
import {
	getPaymentsRequest,
	addPaymentRequest,
	removePaymentRequest,
} from "../../services/financesStatement/services";
import { useAlertConfirmation } from "../../sharedComponents/AlertMessageConfirmation/hooks";
import AlertMessageConfirmation from "../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";
import { getMomentUTC } from "sharedFunctions/sharedFunctions";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAdminStatus } from "sharedHooks/useAdminStatus";

export default function FinanceStatementPage() {
	const isAdmin = useAdminStatus();
	const queryClient = useQueryClient();
	const { data: paymentsList = [], isLoading } = useQuery(
		"finance-statements",
		getPaymentsRequest,
		{
			enabled: !!isAdmin,
			onError: () => {
				setAlertInfo({
					mainTitle: "Something went wrong while fetching finance statements",
					status: false,
				});
				openAlert();
			},
		},
	);
	const [deletedPayment, setDeletedPayment] = useState(null);
	const [alertInfo, setAlertInfo] = useState({
		mainTitle: "No message had been put",
		status: true,
	});

	const {
		alertStatusConfirmation,
		openAlertConfirmation,
		closeAlertConfirmationNoReload,
	} = useAlertConfirmation();
	const { alertOpen, closeAlert, openAlert } = useAlert();

	const addPaymentMutation = useMutation(addPaymentRequest, {
		onSuccess: () => {
			queryClient.invalidateQueries("finance-statements");
			setAlertInfo({
				mainTitle: "New payment has been added",
				status: true,
			});
			openAlert();
		},
		onError: (err) => {
			const message = err?.response?.body?.error || "An error occurred";
			setAlertInfo({
				mainTitle: message,
				status: false,
			});
			openAlert(5000);
		},
	});

	const deletePaymentMutation = useMutation(removePaymentRequest, {
		onSuccess: () => {
			queryClient.invalidateQueries("finance-statements");
			closeAlertConfirmationNoReload();
			openAlert();
		},
		onError: (err) => {
			const message = err?.response?.body?.error || "An error occurred";
			setAlertInfo({
				mainTitle: message,
				status: false,
			});
			openAlert();
		},
	});

	function pressDeleteButton(_id) {
		const payment = paymentsList.find((item) => item._id === _id);
		setDeletedPayment(payment);
		openAlertConfirmation();
		setAlertInfo({
			...alertInfo,
			mainTitle: "Payment has been deleted successfully",
			status: true,
		});
	}

	async function createNewPayment(payment) {
		setDeletedPayment(null);
		const newPayment = {
			...payment,
			date: payment.date.format(),
			receiverID: payment.receiver.id,
			receiver: payment.receiver.label,
		};
		await addPaymentMutation.mutateAsync(newPayment);
	}

	const deletePayment = () => {
		deletePaymentMutation.mutate(deletedPayment._id);
	};

	const getStatementGroupedByDates = (statements) => {
		const arrayWithUniqueDates = [
			...new Set(
				statements.map((item) => {
					return getMomentUTC(item.date).format("YYYY-MM-DD");
				}),
			),
		];
		const sortedArrayWithUniqueDates = arrayWithUniqueDates.sort().reverse();
		const arrayWithGroupedDates = sortedArrayWithUniqueDates.map((data) => {
			const groupedByDatesArray = [];
			statements.forEach((statement) => {
				if (getMomentUTC(statement.date).format("YYYY-MM-DD") === data) {
					groupedByDatesArray.unshift(statement);
				}
			});
			const statementsGroupedByDate = {
				date: data,
				dateGroup: groupedByDatesArray,
			};
			return statementsGroupedByDate;
		});
		return arrayWithGroupedDates;
	};

	const arrayOfStatementsGroupedByDate =
		getStatementGroupedByDates(paymentsList);

	return (
		<>
			{!isLoading && (
				<>
					<div className={"main-container scrolled-container"}>
						{arrayOfStatementsGroupedByDate.length > 0 && (
							<div className={"finances-inner-wrapper"}>
								{arrayOfStatementsGroupedByDate.map((item, index) => (
									<PaymentsGroup
										key={index}
										{...item}
										deleteOneStatement={pressDeleteButton}
									/>
								))}
							</div>
						)}
						{arrayOfStatementsGroupedByDate.length === 0 && (
							<h1>No payments yet</h1>
						)}
					</div>
					<div className="socials button-add-container">
						<FinancesForm handleNewPayment={createNewPayment} />
					</div>
					<AlertMessageConfirmation
						mainText={"Please confirm that you want to delete this payment?"}
						open={alertStatusConfirmation}
						handleClose={closeAlertConfirmationNoReload}
						handleOpen={openAlertConfirmation}
						status={true}
						onCancel={closeAlertConfirmationNoReload}
						onConfirm={deletePayment}
					/>

					<AlertMessage
						mainText={alertInfo.mainTitle}
						open={alertOpen}
						handleOpen={openAlert}
						handleClose={closeAlert}
						status={alertInfo.status}
					/>
				</>
			)}
			{isLoading && <Loader />}
		</>
	);
}
