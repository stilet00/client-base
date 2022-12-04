import SingleChart from './SingleChart/SingleChart'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Loader from '../../sharedComponents/Loader/Loader'
import Unauthorized from '../AuthorizationPage/Unauthorized/Unauthorized'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import AlertMessageConfirmation from '../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation'
import moment from 'moment'
import YearSelect from '../../sharedComponents/YearSelect/YearSelect'
import { useChartsContainer } from './businessLogic'
import '../../styles/modules/Chart.css'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

function ChartsContainer({ user }) {
    const {
        arrayOfYears,
        closeAlert,
        alertOpen,
        alertStatusConfirmation,
        cancelDeleteGraphClicked,
        closeAlertConfirmationNoReload,
        deletedMonth,
        deleteGraph,
        deleteGraphClicked,
        emptyStatus,
        handleChange,
        months,
        openAlertConfirmation,
        selectedYear,
        category,
        setCategory,
    } = useChartsContainer(user)

    const handleCategoryChange = e => {
        setCategory(e.target.value)
    }

    return user ? (
        <>
            {/* <div className={'socials button-add-container top-button'}>
                <AccessTimeIcon />
                <YearSelect
                    arrayOfYears={arrayOfYears}
                    year={selectedYear}
                    handleChange={handleChange}
                />
            </div> */}
            <div className={'main-container  scrolled-container animated-box'}>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Category
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            label="Category"
                            onChange={handleCategoryChange}
                        >
                            <MenuItem value={'chats'}>Chats</MenuItem>
                            <MenuItem value={'letters'}>Letters</MenuItem>
                            <MenuItem value={'dating'}>Dating</MenuItem>
                            <MenuItem value={'phoneCalls'}>
                                Phone Calls
                            </MenuItem>
                            <MenuItem value={'virtualGiftsSvadba'}>
                                Virtual Gifts Svadba
                            </MenuItem>
                            <MenuItem value={'virtualGiftsDating'}>
                                Virtual Gifts Dating
                            </MenuItem>
                            <MenuItem value={'photoAttachments'}>
                                Photo Attachments
                            </MenuItem>
                            <MenuItem value={'penalties'}>Penalties</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {months.length > 0 ? (
                    <ul className={'chart-list'}>
                        {months.map((month, index) => (
                            <SingleChart
                                previousMonth={
                                    month.month === moment().format('MM')
                                        ? months[index + 1]
                                        : null
                                }
                                graph={month}
                                index={index}
                                key={index}
                                deleteGraph={deleteGraph}
                            />
                        ))}
                    </ul>
                ) : emptyStatus ? (
                    <h1> No data available. </h1>
                ) : (
                    <Loader />
                )}
            </div>
            <AlertMessage
                mainText={'Data has been added!'}
                open={alertOpen}
                handleClose={closeAlert}
                status={true}
            />
            <AlertMessageConfirmation
                mainText={'Please confirm that you want to delete chart?'}
                additionalText={
                    deletedMonth
                        ? `Deleting month: ${moment(
                              `${deletedMonth.year}-${deletedMonth.month}`
                          ).format('MMMM-YYYY')}`
                        : null
                }
                open={alertStatusConfirmation}
                handleClose={closeAlertConfirmationNoReload}
                handleOpen={openAlertConfirmation}
                status={false}
                onCancel={cancelDeleteGraphClicked}
                onConfirm={deleteGraphClicked}
            />
        </>
    ) : (
        <Unauthorized />
    )
}

export default ChartsContainer