import React from 'react'
import '../../styles/sharedComponents/SmallLoader.css'
function SmallLoader() {
    return (
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default SmallLoader
