import requestWithAuth from "./superAgentConfig";
import { rootURL } from "./rootURL";

const overviewURL = `${rootURL}overview`;

export function getOverviewDataRequest({
	selectedYear = "2024",
}: {
	selectedYear?: string;
}) {
	return requestWithAuth(
		"get",
		`${overviewURL}/get?selectedYear=${selectedYear}`,
	);
}
