import { useSelector } from "react-redux";

type User = {
	email: string;
	displayName: string | null;
	emailVerified: boolean;
	uid: string;
	isAdmin: boolean;
};

export function useAdminStatus() {
	const user = useSelector<{ auth: { user: User | null } }, User | null>(
		(state) => state.auth.user,
	);
	if (!user) {
		return false;
	}
	return user.isAdmin;
}
