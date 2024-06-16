import React from "react";
import "styles/sharedComponents/Loader.css";

function Loader({ position, style = {}, loaderColor = null }) {
	return (
		<div className="lds-facebook" style={{ top: position, ...style }}>
			<div style={loaderColor ? { background: loaderColor } : null}></div>
			<div style={loaderColor ? { background: loaderColor } : null}></div>
			<div style={loaderColor ? { background: loaderColor } : null}></div>
		</div>
	);
}

export default Loader;
