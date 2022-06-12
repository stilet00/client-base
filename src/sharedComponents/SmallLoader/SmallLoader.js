import React from 'react'
import '../../styles/sharedComponents/SmallLoader.css'
import dollarLoader from '../../images/dollar-loader.png'
function SmallLoader() {
    return (
        <div
            className="lds-ring"
            style={{
                backgroundImage: `url(${dollarLoader})`,
                backgroundSize: 'cover',
                animationDuration: `${(Math.random() * 10).toFixed(1)}s`,
                animationDirection: Math.random() < 0.5 ? 'normal' : 'reverse',
            }}
        ></div>
    )
}

export default SmallLoader
