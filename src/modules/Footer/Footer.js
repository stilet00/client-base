import React from "react";
import "../../styles/modules/Footer.css";
import { getMomentUTC } from "sharedFunctions/sharedFunctions";

function Footer() {
	return (
		<div className={"footer"}>
			<p>
				{`Node env: ${process.env.NODE_ENV}`}
				{/* {`Made by Stilet 2021 - ${getMomentUTC().format(
					"YYYY",
				)}. Version ${process.env.REACT_APP_SUNRISE_AGENCY_VERSION}`} */}
			</p>
		</div>
	);
}

export default Footer;
