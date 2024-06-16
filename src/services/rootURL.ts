type Environment = "staging" | "production" | "development";

const rootURLOptions: Record<Environment, string> = {
	staging: "https://sunrise-agency-staging-fdbbf113d1fd.herokuapp.com/",
	production: "https://sunrise-agency.herokuapp.com/",
	development: "http://localhost:80/",
};

export const rootURL = rootURLOptions[process.env.NODE_ENV as Environment];
