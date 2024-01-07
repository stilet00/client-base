const rootURLOptions = {
    production: 'https://sunrise-agency.herokuapp.com/',
    staging: 'https://sunrise-agency-staging-fdbbf113d1fd.herokuapp.com/',
    development: 'http://localhost:80/',
}
export const rootURL = rootURLOptions[process.env.NODE_ENV]
