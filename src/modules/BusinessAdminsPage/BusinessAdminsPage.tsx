import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Button from "@mui/material/Button";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import {
	getBusinessAdmins,
	deleteBusinessAdmin,
} from "services/businessAdministratorsServices";
import Loader from "sharedComponents/Loader/Loader";
import MESSAGES from "constants/messages";
import { useAdminStatus } from "sharedHooks/useAdminStatus";
import BusinessAdminsForm from "./BusinessAdminsForm";
import { BusinessAdmin } from "api/models/businessAdminsDatabaseModels";
import useModal from "sharedHooks/useModal";
import "../../styles/modules/BusinessAdminsPage.css";

interface BusinessAdminsPageProps {}

const BusinessAdminsPage: React.FC<BusinessAdminsPageProps> = (props) => {
	const { handleClose, handleOpen, open } = useModal();
	const [selectedAdmin, setSelectedAdmin] = useState<BusinessAdmin | null>(
		null,
	);
	const queryClient = useQueryClient();
	const isAdmin = useAdminStatus();

	const deleteMutation = useMutation(deleteBusinessAdmin, {
		onSuccess: () => {
			queryClient.invalidateQueries("businessAdministratorsQuery");
		},
		onError: () => {
			console.error("Failed to delete business admin");
		},
	});

	const handleDelete = (adminId: string) => {
		deleteMutation.mutate(adminId);
	};

	const fetchBusinessAdministrators = async () => {
		const response = await getBusinessAdmins({});
		if (response.status !== 200) {
			throw new Error(MESSAGES.somethingWentWrongWithBusinessAdmins.text);
		}
		return response.body;
	};

	const { data, isLoading } = useQuery(
		"businessAdministratorsQuery",
		fetchBusinessAdministrators,
		{
			enabled: !!isAdmin,
			onSuccess: (data) => {
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
			<div className="main-container scrolled-container">
				{data?.length === 0 ? (
					<h1>No business administrators yet</h1>
				) : (
					<ul className="business-admins-list">
						{data?.map((admin: BusinessAdmin) => (
							<li key={admin._id} className="business-admin-item">
								<div className="admin-icon">
									<SupervisorAccountIcon />
								</div>
								<div className="admin-info">
									<p className="admin-name">
										<strong>Name:</strong> {admin.name}
									</p>
									<p className="admin-surname">
										<strong>Surname:</strong> {admin.surname}
									</p>
									<p className="admin-email">
										<strong>Email:</strong> {admin.email}
									</p>
								</div>
								<Button
									type="button"
									onClick={() => {
										setSelectedAdmin(admin);
										handleOpen();
									}}
									variant="outlined"
									className="edit-button"
								>
									Edit
								</Button>
								<Button
									type="button"
									onClick={() => handleDelete(admin?._id)}
									variant="outlined"
									className="delete-button"
								>
									Delete
								</Button>
							</li>
						))}
					</ul>
				)}
			</div>
			<div className="socials button-add-container">
				<Button
					type="button"
					onClick={handleOpen}
					startIcon={<SupervisorAccountIcon />}
					disabled={!isAdmin}
					fullWidth
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
		</>
	);
};

export default BusinessAdminsPage;
