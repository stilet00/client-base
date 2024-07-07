import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { getBusinessAdmins } from "services/businessAdministratorsServices";
import MESSAGES from "constants/messages";

interface BusinessAdminsPageProps {
	// Define any props if needed
}

const BusinessAdminsPage: React.FC<BusinessAdminsPageProps> = (props) => {
	const user = useSelector((state: any) => state.auth.user);
	const fetchBusinessAdministrators = async () => {
		const response = await getBusinessAdmins({});
		if (response.status !== 200) {
			throw new Error(MESSAGES.somethingWentWrongWithBusinessAdmins.text);
		}
		return response.body;
	};
	const { data, isLoading, refetch } = useQuery(
		"businessAdministratorsQuery",
		fetchBusinessAdministrators,
		{
			enabled: !!user,
			onSuccess: (data) => {
				console.log(data);
				return data;
			},
			onError: () =>
				console.error(MESSAGES.somethingWentWrongWithBusinessAdmins.text),
		},
	);
	return (
		<div className={"main-container scrolled-container"}>
			<div className={"finances-inner-wrapper"}>HELLO</div>
			{/* {arrayOfStatementsGroupedByDate.length === 0 && (
							<h1>No payments yet</h1>
						)} */}
		</div>
	);
};

export default BusinessAdminsPage;
