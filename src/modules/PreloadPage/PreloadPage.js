import React from 'react'
import '../../styles/modules/PreloadPage.css'
import styled from 'styled-components'
import moment from 'moment'
import SignalShapedLoader from '../../sharedComponents/SignalShapedLoader/SignalShapedLoader'
import Loader from '../../sharedComponents/Loader/Loader'

const PreloaderOuterContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: ${props => (props.isLoaded ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;\
`

function PreloadPage({ isLoaded }) {
    const isEveningTime = moment().isSameOrAfter(
        moment('9:00:00 pm', 'h:mm:ss a')
    )
    const isNightTime = moment().isBetween(
        moment('12:00:00 am', 'h:mm:ss a'),
        moment('7:00:00 am', 'h:mm:ss a')
    )
    const shouldShowNightPreload = isEveningTime || isNightTime
    return (
        <>
            {shouldShowNightPreload && (
                <PreloaderOuterContainer isLoaded={isLoaded}>
                    <div className={'background-container'} />
                    <div className="stars" />
                    <div className="twinkling" />
                    <SignalShapedLoader />
                </PreloaderOuterContainer>
            )}
            {!shouldShowNightPreload && (
                <div
                    className={
                        isLoaded ? 'preload-page' : 'preload-page invisible'
                    }
                >
                    <Loader position={'0'} />
                </div>
            )}
        </>
    )
}

export default PreloadPage
