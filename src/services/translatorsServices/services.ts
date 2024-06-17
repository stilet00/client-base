import requestWithAuth from "../superAgentConfig";
import { rootURL } from "../rootURL";
import type {
	BalanceDay,
	PersonalPenalty,
	Translator,
} from "../../api/models/translatorsDatabaseModels";

const translatorsURL = rootURL + "translators/";
const balanceDayURL = rootURL + "balance-day/";
const personalPenaltyURL = rootURL + "personal-penalty/";

export function getTranslators({ searchQuery = "", shouldGetClients = false }) {
	let queryParams = "";
	if (searchQuery) {
		queryParams +=
			(queryParams ? "&" : "?") +
			`searchQuery=${encodeURIComponent(searchQuery)}`;
	}
	if (shouldGetClients) {
		queryParams += (queryParams ? "&" : "?") + "shouldGetClients=true";
	}
	return requestWithAuth("get", translatorsURL + "get/" + queryParams);
}

export function addTranslator(translator: Translator) {
	return requestWithAuth("post", translatorsURL + "add/").send(translator);
}

export function removeTranslator(id: string) {
	return requestWithAuth("delete", translatorsURL + id);
}

export function updateTranslator(translator: Translator) {
	return requestWithAuth("put", translatorsURL + translator._id).send(
		translator,
	);
}

export function assignClientToTranslatorRequest({
	clientId,
	translatorId,
}: {
	clientId: string;
	translatorId: string;
}) {
	return requestWithAuth("put", translatorsURL + "assign-client").send({
		clientId,
		translatorId,
	});
}

export function sendNotificationEmailsRequest() {
	return requestWithAuth("get", translatorsURL + "send-emails");
}

export function sendLastVirtualGiftDateRequest(id: string) {
	return requestWithAuth("get", translatorsURL + "last-gift/" + id);
}

export function getBalanceDay({
	translatorId,
	clientId,
	dateTimeId,
}: {
	translatorId: string;
	clientId: string;
	dateTimeId: string;
}) {
	return requestWithAuth(
		"get",
		`${balanceDayURL}?translatorId=${translatorId}&clientId=${clientId}&dateTimeId=${encodeURIComponent(
			dateTimeId,
		)}`,
	);
}

export function createBalanceDay({
	newBalanceDay,
}: {
	newBalanceDay: BalanceDay;
}) {
	return requestWithAuth("post", balanceDayURL + "create").send({
		...newBalanceDay,
	});
}

export function updateBalanceDay({
	balanceDayToSubmit,
}: {
	balanceDayToSubmit: BalanceDay;
}) {
	return requestWithAuth("put", balanceDayURL + "update").send({
		...balanceDayToSubmit,
	});
}

export function getBalanceDaysForTranslatorRequest({
	dateTimeFilter = "",
	translatorId = "",
}) {
	return requestWithAuth(
		"get",
		`${balanceDayURL}translators?dateTimeFilter=${dateTimeFilter}&translatorId=${translatorId}`,
	);
}

export function getPenaltiesForTranslatorRequest({
	dateTimeFilter = "",
	translatorId = "",
}) {
	return requestWithAuth(
		"get",
		`${personalPenaltyURL}get?dateTimeFilter=${dateTimeFilter}&translatorId=${translatorId}`,
	);
}

export async function createPersonalPenalty({
	personalPenaltyData,
}: {
	personalPenaltyData: PersonalPenalty;
}) {
	return requestWithAuth("post", `${personalPenaltyURL}create`).send(
		personalPenaltyData,
	);
}

export async function toggleClientSuspendedRequest({
	clientId,
	translatorId,
}: {
	clientId: string;
	translatorId: string;
}) {
	return requestWithAuth("put", `${translatorsURL}suspend-client`).send({
		clientId,
		translatorId,
	});
}
