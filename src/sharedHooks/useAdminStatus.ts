import { useState, useEffect } from "react";
import requestWithAuth from "../services/superAgentConfig";
import { rootURL } from "../services/rootURL";

type User = {
	email: string;
};

async function checkAdminStatus(user: User) {
	try {
		const response = await requestWithAuth("post", `${rootURL}isAdmin`).send({
			email: user.email,
		});
		return response.body;
	} catch (error) {
		console.error("Error checking admin role:", error);
		return false;
	}
}

export function useAdminStatus(user: User) {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			setIsAdmin(false);
			setIsLoading(false);
		} else {
			(async () => {
				const isAdmin = await checkAdminStatus(user);
				setIsAdmin(isAdmin);
				setIsLoading(false);
			})();
		}
	}, [user]);

	return { isAdmin, isLoading };
}
