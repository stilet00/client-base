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
    const [arrayWithAmounts, setArrayWithAmounts] = useState([])
    useEffect(() => {
        if (months.length > 0 && moment().format('DD') < 31) {
            setArrayWithAmounts(values.slice(0, values.length - 1))
        }
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
                {months.length > 0 ? (
                    <SingleChart
                        className={'test-div'}
                        values={arrayWithAmounts}
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
