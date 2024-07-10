import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { getBusinessAdmins } from "services/businessAdministratorsServices";
import Loader from "sharedComponents/Loader/Loader";
import MESSAGES from "constants/messages";
import { useAdminStatus } from "sharedHooks/useAdminStatus";
import BusinessAdminsForm from "./BusinessAdminsForm";
import { BusinessAdmin } from "api/models/businessAdminsDatabaseModels";
import useModal from "sharedHooks/useModal";

interface BusinessAdminsPageProps {}

const BusinessAdminsPage: React.FC<BusinessAdminsPageProps> = (props) => {
	const { handleClose, handleOpen, open } = useModal();
	const [selectedAdmin, setSelectedAdmin] = useState<BusinessAdmin | null>(
		null,
	);
	const user = useSelector((state: any) => state.auth.user);
	const { isAdmin } = useAdminStatus(user);

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
	if (isLoading) {
		return <Loader />;
	}
	return (
		<>
			<div className={"main-container scrolled-container"}>
				{data?.length === 0 && <h1>No business administrators yet</h1>}
			</div>
			<div className="socials button-add-container">
				<Button
					type="button"
					onClick={handleOpen}
					fullWidth
					startIcon={<SupervisorAccountIcon />}
					disabled={!isAdmin}
				>
					Add Business Admin
				</Button>
				<BusinessAdminsForm
					handleClose={handleClose}
					formOpen={open}
					selectedAdmin={selectedAdmin}
					setSelectedAdmin={setSelectedAdmin}
				/>
			</div>
			{/* <AlertMessage
			mainText={alertInfo.mainTitle}
			open={alertOpen}
			handleOpen={openAlert}
			handleClose={closeAlert}
			status={alertInfo.status}
		/> */}
		</>
	);
};

export default BusinessAdminsPage;
