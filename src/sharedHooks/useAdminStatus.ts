import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import requestWithAuth from "../services/superAgentConfig";
import { rootURL } from "../services/rootURL";

type User = {
	email: string;
	displayName: string | null;
	emailVerified: boolean;
	uid: string;
};

async function checkAdminStatus(user: User): Promise<boolean> {
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

export function useAdminStatus() {
	const user = useSelector<{ auth: { user: User | null } }, User | null>(
		(state) => state.auth.user,
	);

	const { data: isAdmin, isLoading } = useQuery(
		["adminStatus", user?.email],
		() => checkAdminStatus(user as User),
		{
			enabled: !!user,
			retry: false,
			staleTime: 1000 * 60 * 5,
		},
	);

	return { isAdmin: isAdmin ?? false, isLoading };
}
