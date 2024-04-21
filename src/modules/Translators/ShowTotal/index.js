import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getMomentUTC } from 'sharedFunctions/sharedFunctions'
import { useQuery } from 'react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { getBalanceTotalForCurrentMonthRequest } from 'services/balanceDayServices/index'
import Loader from 'sharedComponents/Loader/Loader'
import { getBalanceDayForSelectedDate } from '../../../services/balanceDayServices'
import moment from 'moment'

const StyledButton = styled(Button)`
    && {
        color: black;
    }
`
const TotalButtonWithPopover = ({
    screenIsSmall,
    selectedDate = moment().subtract(1, 'day').format('YYYY-MM-DD'),
}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [sumForDay, setSumForDay] = useState([])
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

    function calculateStatisticsForDay(data) {
        const sumsPerObject = []
        data.forEach(item => {
            const sum = Object.values(item.statistics).reduce((acc, value) => {
                return acc + (typeof value === 'number' ? value : 0)
            }, 0)

            sumsPerObject.push(sum)
        })

        const totalSum = sumsPerObject
            .reduce((acc, sum) => acc + sum, 0)
            .toFixed(2)
        return totalSum
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await getBalanceDayForSelectedDate(selectedDate)
            setSumForDay(calculateStatisticsForDay(res.data))
        }
        if (!selectedDate) {
            return
        }
        fetchData()
    }, [selectedDate])

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
                    <>
                        <Typography sx={{ p: 1 }} align={'left'}>
                            {`Total by ${selectedDate.format('D MMMM')}: `}{' '}
                            <b>{sumForDay}</b>
                        </Typography>
                        <Typography sx={{ p: 1 }} align={'left'}>
                            {`Total by ${getMomentUTC().format('D MMMM')}: `}{' '}
                            <b>
                                <b>{`${data?.data} $`}</b>
                            </b>
                        </Typography>
                    </>
                )}
            </Popover>
        </>
    )
}

export default TotalButtonWithPopover
