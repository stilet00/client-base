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
                animationDelay: `-${Math.random().toFixed(1)}s`,
            }}
        ></div>
    )
}

export default SmallLoader
