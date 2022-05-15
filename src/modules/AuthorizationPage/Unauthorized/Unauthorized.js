import React, { useState, useEffect } from 'react'
import '../../../styles/modules/Unauthorized.css'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { fadeOut } from 'react-animations'
import styled, { keyframes } from 'styled-components'
import HomeIcon from '@mui/icons-material/Home'

const Animate = styled.div`
    animation: 6s ${keyframes`${fadeOut}`};
    width: 100%;
    height: 100%;
`

function Unauthorized() {
    const [time, setTime] = useState(3)

    const history = useHistory()

    function reduceTime() {
        if (time > 1) {
            setTime(time - 1)
        } else {
            history.push('/')
        }
    }

    useEffect(() => {
        const timeCount = setTimeout(reduceTime, 1000)
        return () => {
            // cancel the subscription
            clearTimeout(timeCount)
        }
    })

    return (
        <Animate>
            <div className={'unauthorized'}>
                <h1>You should log in before using this service...</h1>
                <p>You will be redirected in ...{time}</p>
                <Button
                    onClick={() => history.push('/')}
                    variant={'outlined'}
                    startIcon={<HomeIcon />}
                >
                    Back
                </Button>
            </div>
        </Animate>
    )
}

export default Unauthorized
