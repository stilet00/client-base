export const rootURL =
	process.env.NODE_ENV === "development"
		? "http://localhost:80/"
		: `${window.location.origin}/`;
