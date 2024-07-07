import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { getBusinessAdmins } from "services/businessAdministratorsServices";
import Loader from "sharedComponents/Loader/Loader";
import MESSAGES from "constants/messages";

interface BusinessAdminsPageProps {}

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
	console.log(data);
	if (isLoading) {
		return <Loader />;
	}
	return (
		<div className={"main-container scrolled-container"}>
			{/* <div className={'finances-inner-wrapper'}>HELLO</div> */}
			{data?.length === 0 && <h1>No business administrators yet</h1>}
		</div>
	);
};

export default BusinessAdminsPage;
