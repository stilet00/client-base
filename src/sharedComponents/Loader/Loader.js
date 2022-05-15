import React from 'react'
import '../../styles/sharedComponents/Loader.css'
function Loader({ position }) {
    return (
        <div className="lds-facebook" style={{ top: position }}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default Loader
