import React from "react";
import "../../styles/modules/PreloadPage.css";
import styled from "styled-components";
import SignalShapedLoader from "../../sharedComponents/SignalShapedLoader/SignalShapedLoader";
import Loader from "../../sharedComponents/Loader/Loader";
import useNightTime from "../../sharedHooks/useNightTime";

const PreloaderOuterContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: ${(props) => (props.isLoading ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;\
`;

function PreloadPage({ isLoading }) {
	const shouldShowNightPreload = useNightTime();
	return (
		<>
			{shouldShowNightPreload && (
				<PreloaderOuterContainer isLoading={isLoading}>
					<div className={"background-container"} />
					<div className="stars" />
					<div className="twinkling" />
					<SignalShapedLoader />
				</PreloaderOuterContainer>
			)}
			{!shouldShowNightPreload && (
				<div className={isLoading ? "preload-page" : "preload-page invisible"}>
					<Loader position={"0"} />
				</div>
			)}
		</>
	);
}

export default PreloadPage;
