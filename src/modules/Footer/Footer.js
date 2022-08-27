import React from 'react'
import '../../styles/modules/Footer.css'
import moment from 'moment'
function Footer() {
    return (
        <div className={'footer'}>
            <p>
                {`Made by Stilet 2021 - ${moment().format('YYYY')}. Version ${
                    process.env.REACT_APP_SUNRISE_AGENCY_VERSION
                }`}
            </p>
        </div>
    )
}

export default Footer
