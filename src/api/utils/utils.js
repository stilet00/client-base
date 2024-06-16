const moment = require("moment");

const getMomentUTC = (date = undefined, format = undefined) =>
	moment(date, format).utc();

module.exports = {
	getMomentUTC,
};
