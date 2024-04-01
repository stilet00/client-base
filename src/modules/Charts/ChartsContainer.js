import React from 'react'
import { useSelector } from 'react-redux'
import SingleChart from './SingleChart/SingleChart'
import Loader from '../../sharedComponents/Loader/Loader'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import AlertMessageConfirmation from '../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation'
import moment from 'moment'
import { useChartsContainer } from './businessLogic'
import '../../styles/modules/Chart.css'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import {
    CHARTS_CATEGORIES,
    arrayOfYearsForSelectFilter,
} from '../../constants/constants'

function ChartsContainer() {
    const user = useSelector(state => state.auth.user)
    const {
        closeAlert,
        alertOpen,
        alertStatusConfirmation,
        cancelDeleteGraphClicked,
        closeAlertConfirmationNoReload,
        deletedMonth,
        deleteGraph,
        deleteGraphClicked,
        handleChange,
        months,
        openAlertConfirmation,
        selectedYear,
        category,
        setCategory,
        balanceDaysAreLoading,
    } = useChartsContainer(user)

    const handleCategoryChange = e => {
        setCategory(e.target.value)
    }

    return (
        <>
            {/* <div className={'socials button-add-container top-button'}>
        <AccessTimeIcon />
        <YearSelect
            arrayOfYears={arrayOfYears}
            year={selectedYear}
            handleChange={handleChange}
        />
    </div> */}
            <div
                style={{
                    width: '60%',
                    margin: '0 auto',
                    dislpay: 'flex',
                    flexDirection: 'row',
                    zIndex: 3,
                }}
            >
                <FormControl
                    sx={{
                        minWidth: '50%',
                        maxWidth: '70%',
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '2px solid',
                            borderColor: 'white',
                            borderBottom: 'none',
                            borderRight: 'none',
                        },
                    }}
                >
                    <InputLabel id="demo-simple-select-label">
                        Category
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        variant="outlined"
                        label="Category"
                        value={category}
                        sx={{
                            borderRadius: '4px 0 0 0',
                            color: 'white',
                            '& .MuiSvgIcon-root': {
                                color: 'white',
                            },
                        }}
                        onChange={handleCategoryChange}
                    >
                        {CHARTS_CATEGORIES.map(singleCategory => (
                            <MenuItem
                                value={singleCategory.value}
                                key={singleCategory.value}
                            >
                                {singleCategory.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl
                    sx={{
                        minWidth: '30%',
                        maxWidth: '50%',
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '2px solid',
                            borderColor: 'white',
                            borderBottom: 'none',
                            borderLeft: 'none',
                        },
                    }}
                >
                    <Select
                        value={selectedYear}
                        sx={{
                            borderRadius: '0 4px 0 0',
                            color: 'white',
                            '& .MuiSvgIcon-root': {
                                color: 'white',
                            },
                        }}
                        onChange={handleChange}
                    >
                        {arrayOfYearsForSelectFilter.map(year => (
                            <MenuItem value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className={'main-container  scrolled-container animated-box'}>
                {balanceDaysAreLoading && <Loader />}
                {!balanceDaysAreLoading && (
                    <>
                        {months?.length > 0 && (
                            <ul className={'chart-list'}>
                                {months.map((month, index) => (
                                    <SingleChart
                                        previousMonth={
                                            month.month ===
                                            moment().format('MM')
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
                        )}
                        {months?.length === 0 && <h1> No data available. </h1>}
                    </>
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
    )
}

export default ChartsContainer
