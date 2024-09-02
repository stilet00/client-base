import React from "react";
import "styles/sharedComponents/Loader.css";

function Loader({
	position = undefined,
	style = {},
	loaderColor = undefined,
}: {
	position?: string;
	style?: React.CSSProperties;
	loaderColor?: string;
}) {
	return (
		<div className="lds-facebook" style={{ top: position, ...style }}>
			<div style={loaderColor ? { background: loaderColor } : {}}></div>
			<div style={loaderColor ? { background: loaderColor } : {}}></div>
			<div style={loaderColor ? { background: loaderColor } : {}}></div>
		</div>
	);
}

export default Loader;
