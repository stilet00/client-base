import { getMomentUTC } from "sharedFunctions/sharedFunctions";
import SinglePayment from "./SinglePayment";

export default function PaymentsGroup({ date, dateGroup, deleteOneStatement }) {
	return (
		<>
			<div className={"finances-inner-wrapper__header"}>
				{getMomentUTC(date).format(`YYYY MM DD`)}
			</div>
			{dateGroup.map((data) => (
				<SinglePayment key={data._id} {...data} onDelete={deleteOneStatement} />
			))}
		</>
	);
}
