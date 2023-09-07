import { styled } from '@mui/system'
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import InputAdornment from '@mui/material/InputAdornment'
import SumArray from '../../../sharedComponents/SumArray/SumArray'
import { useChartForm } from '../businessLogic'

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

const StyledFormControl = styled(FormControl)({
    margin: '1rem',
    minWidth: 120,
})
const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root:first-child': {
        background: 'rgba(210,206,206,0.5)',
    },
})

export default function ChartForm(props) {
    const {
        handleOpen,
        months,
        handleChange,
        getTotalDays,
        handleClose,
        onFormSubmit,
        open,
        onValuesSubmit,
        selectedMonth,
        valuesArray,
        year,
    } = useChartForm(props)

    return (
        <div className={'modal-wrapper'}>
            <Button type="button" onClick={handleOpen} fullWidth>
                Add month
                <AddIcon />
            </Button>
            <StyledModal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={'form-container chart-form'}>
                        <form onSubmit={onFormSubmit}>
                            <h2 id="transition-modal-title">
                                Enter parameters:
                            </h2>
                            <StyledTextField
                                id="filled-basic"
                                value={year}
                                variant="outlined"
                                fullWidth
                                type={'number'}
                                disabled
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CalendarTodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <StyledFormControl variant="outlined" fullWidth>
                                <InputLabel id="demo-simple-select-outlined-label">
                                    Month
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={selectedMonth}
                                    onChange={handleChange}
                                    label="Month"
                                >
                                    <MenuItem value="" disabled>
                                        <em>None</em>
                                    </MenuItem>
                                    {months.map((month, index) => (
                                        <MenuItem value={index + 1} key={month}>
                                            {month}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </StyledFormControl>
                            <SumArray
                                getTotalDays={getTotalDays}
                                selectedMonth={selectedMonth}
                                onSubmit={onValuesSubmit}
                                year={year}
                                valuesStatus={valuesArray.length > 0}
                            />
                            <Button
                                type={'submit'}
                                fullWidth
                                variant={'outlined'}
                            >
                                Add chart
                            </Button>
                        </form>
                    </div>
                </Fade>
            </StyledModal>
        </div>
    )
}
