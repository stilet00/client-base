import React, { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { useQuery } from 'react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { getBalanceTotalForCurrentMonthRequest } from 'services/balanceDayServices/index'
import Loader from 'sharedComponents/Loader/Loader'

const StyledButton = styled(Button)`
    && {
        color: black;
    }
`
const TotalButtonWithPopover = ({ screenIsSmall }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }
    const open = Boolean(anchorEl)
    const popoverId = open ? 'simple-popover' : undefined
    const handleClose = () => {
        setAnchorEl(null)
    }
    const { data, isLoading } = useQuery(
        'balanceDays',
        getBalanceTotalForCurrentMonthRequest,
        {
            enabled: !!anchorEl,
        }
    )
    return (
        <>
            <StyledButton
                aria-describedby={popoverId}
                onClick={handleClick}
                fullWidth={screenIsSmall}
                startIcon={<FontAwesomeIcon icon={faPiggyBank} />}
            >
                Show total
            </StyledButton>
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                className={'sum-popover'}
            >
                {isLoading && <Loader />}
                {!isLoading && (
                    <Typography sx={{ p: 2 }} align={'left'}>
                        {`Total by ${moment().format('D MMMM')}: `}{' '}
                        <b>
                            <b>{`${data?.data} $`}</b>
                        </b>
                    </Typography>
                )}
            </Popover>
        </>
    )
}

export default TotalButtonWithPopover
