import { useEffect, useState } from 'react'
import SingleChart from './SingleChart'
import moment from 'moment'
import { useChartsContainer } from '../../Charts/businessLogic'
import '../../../styles/modules/Chart.css'
import Loader from '../../../sharedComponents/Loader/Loader'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

export default function ClientsChartsContainer({
    user,
    values,
    open,
    handleClose,
}) {
    const { months } = useChartsContainer(user)
    const [monthsSums, setMonthsSums] = useState(null)
    const prevMonth = moment().subtract(1, 'month').format('MM')

    useEffect(() => {
        setMonthsSums(values)
    }, [months, values])

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={'clients-chart-list'}>
                <div className={'rotate-on-mobile-portrait'}>
                    <h2>Rotate screen to see the graph</h2>
                </div>
                {monthsSums === null ? (
                    <SingleChart
                        className={'test-div'}
                        values={monthsSums}
                        previousMonth={months.find(
                            month => month.month === prevMonth
                        )}
                        graph={months.find(
                            month => month.month === moment().format('MM')
                        )}
                    />
                ) : (
                    <Loader />
                )}
            </Box>
        </Modal>
    )
}
