import "../../styles/modules/Overview.css";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import CountUp from "react-countup";
import { getMomentUTC } from "sharedFunctions/sharedFunctions";
import { getOverviewDataRequest } from "services/overviewServices";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Loader from "sharedComponents/Loader/Loader";
import { currentYear } from "constants/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowAltCircleUp,
	faArrowAltCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useAdminStatus } from "sharedHooks/useAdminStatus";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

const PercentageDifference = ({ value }: { value: number }) => {
	const isPositive = value > 0;
	const icon = isPositive ? faArrowAltCircleUp : faArrowAltCircleDown;
	const colorClass = isPositive ? "green-text" : "red-text";

	return (
		<span className={`${colorClass} styled-text-numbers`}>
			<FontAwesomeIcon icon={icon} />{" "}
			<CountUp duration={0.75} end={Math.abs(value)} />%
		</span>
	);
};

function Overview() {
	const user = useSelector(
		(state: {
			auth: {
				user: {
					email: string;
					displayName: string;
					emailVerified: boolean;
					uid: string;
					isAdmin: boolean;
				};
			};
		}) => state.auth.user,
	);
	const isAdmin = useAdminStatus();

	const fetchOverviewData = async () => {
		const response = await getOverviewDataRequest({
			selectedYear: currentYear,
		});
		if (response.status !== 200) {
			throw new Error("Something went wrong with overview data");
		}
		return response.body;
	};

	const { isLoading: overviewDataIsLoading, data: overviewData } = useQuery(
		"overviewData",
		fetchOverviewData,
		{
			enabled: !!user,
			onError: () => console.error("Something went wrong with overview data"),
		},
	);

	if (overviewDataIsLoading || !overviewData) {
		return <Loader />;
	}

	const {
		clients,
		activeTranslators,
		monthTotal,
		monthPercentageDifference,
		svadbaMonthTotal,
		svadbaPercentageDifference,
		datingPercentageDifference,
		yearTotal,
		totalPayments,
		totalProfit,
		clientsSalary,
		paymentToScout,
		paymentToBot,
		paymentToTranslator,
	} = overviewData;

	return (
		<div className={"main-container table-container"}>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<StyledTableRow>
							<StyledTableCell>Statistic's type</StyledTableCell>
							<StyledTableCell>Data</StyledTableCell>
							<StyledTableCell />
						</StyledTableRow>
					</TableHead>
					<TableBody>
						<StyledTableRow>
							<StyledTableCell>Current month</StyledTableCell>
							<StyledTableCell>{getMomentUTC().format("MMMM")}</StyledTableCell>
							<StyledTableCell />
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Month balance</StyledTableCell>
							<StyledTableCell>
								<span className="blue-text styled-text-numbers">
									<CountUp duration={0.75} end={monthTotal} prefix="$" />
								</span>
							</StyledTableCell>
							<StyledTableCell>
								<PercentageDifference value={monthPercentageDifference} />
							</StyledTableCell>
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Svadba balance</StyledTableCell>
							<StyledTableCell>
								<span className="blue-text styled-text-numbers">
									<CountUp duration={0.75} end={svadbaMonthTotal} prefix="$" />
								</span>
							</StyledTableCell>
							<StyledTableCell>
								<PercentageDifference value={svadbaPercentageDifference} />
							</StyledTableCell>
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Dating balance</StyledTableCell>
							<StyledTableCell>
								<span className="blue-text styled-text-numbers">
									<CountUp
										duration={0.75}
										end={monthTotal - svadbaMonthTotal}
										prefix="$"
									/>
								</span>
							</StyledTableCell>
							<StyledTableCell>
								<PercentageDifference value={datingPercentageDifference} />
							</StyledTableCell>
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Total clients</StyledTableCell>
							<StyledTableCell>{clients}</StyledTableCell>
							<StyledTableCell />
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Active translators</StyledTableCell>
							<StyledTableCell>{activeTranslators}</StyledTableCell>
							<StyledTableCell />
						</StyledTableRow>
						{isAdmin && (
							<>
								<StyledTableRow>
									<StyledTableCell>Year's balance</StyledTableCell>
									<StyledTableCell>{`$${yearTotal}`}</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Salary paid</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<CountUp duration={0.75} end={totalPayments} prefix="$" />
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Clients Salary</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<CountUp duration={0.75} end={clientsSalary} prefix="$" />
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Payment to scout</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<CountUp
												duration={0.75}
												end={paymentToScout}
												prefix="$"
											/>
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Payment to bot</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<CountUp duration={0.75} end={paymentToBot} prefix="$" />
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Payment to translator</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<CountUp
												duration={0.75}
												end={paymentToTranslator}
												prefix="$"
											/>
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Total profit</StyledTableCell>
									<StyledTableCell>
										<span className="green-text styled-text-numbers">
											<CountUp duration={0.75} end={totalProfit} prefix="$" />
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
							</>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default Overview;
