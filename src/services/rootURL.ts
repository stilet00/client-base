type Environment = "staging" | "production" | "development";

export const rootURLOptions: Record<Environment, string> = {
	staging: "https://sunrise-agency-staging-73929348db48.herokuapp.com/",
	production: "https://sunrise-agency.herokuapp.com/",
	development: "http://localhost:80/",
};

export const rootURL = rootURLOptions[process.env.NODE_ENV as Environment];
