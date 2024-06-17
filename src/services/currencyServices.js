import superagent from "superagent";

const currencyURL =
	"https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";
// using Proxi otherwise privatBank link will not work
export function getCurrency() {
	return superagent.get(
		`https://api.allorigins.win/raw?url=${encodeURIComponent(currencyURL)}`,
	);
}
