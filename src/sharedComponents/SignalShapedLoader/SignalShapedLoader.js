import React from 'react'
import styled from 'styled-components'

const SignalShapedLoaderOuterContainer = styled.div`
    position: relative;

    div {
        top: 0;
        left: 0;
        position: absolute;
        border: 4px solid #fff;
        opacity: 1;
        border-radius: 50%;
        animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        z-index: 3;

        &:nth-child(2) {
            animation-delay: -0.5s;
        }
    }

    @keyframes lds-ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 0;
        }
        4.9% {
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            opacity: 0;
        }
        5% {
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            top: -36px;
            left: -36px;
            width: 72px;
            height: 72px;
            opacity: 0;
        }
    }
`

const SignalShapedLoader = () => {
    return (
        <SignalShapedLoaderOuterContainer>
            <div></div>
            <div></div>``
        </SignalShapedLoaderOuterContainer>
    )
}

export default SignalShapedLoader
