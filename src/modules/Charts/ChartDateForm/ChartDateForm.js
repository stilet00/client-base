import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CheckIcon from '@mui/icons-material/Check'
import ColoredButton from '../../../sharedComponents/ColoredButton/ColoredButton'
import InputAdornment from '@mui/material/InputAdornment'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useChartDateForm } from '../businessLogic'
import {
    StyledModal,
    StyledTextField,
    StyledFormControl,
} from '../../../sharedComponents/StyledMaterial/styledMaterialComponents'

export default function ChartDateForm(props) {
    const {
        monthData,
        handleOpen,
        handleClose,
        open,
        handleChange,
        onSubmit,
        onInputChange,
        selectedDate,
        value,
    } = useChartDateForm(props)

    return (
        <div className={'date-wrapper'}>
            <ColoredButton
                type="button"
                onClick={handleOpen}
                variant={'outlined'}
            >
                <AddBoxIcon />
            </ColoredButton>
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
                    <div className={'form-container chart-date-form'}>
                        <form onSubmit={onSubmit}>
                            <h2 id="transition-modal-title">
                                Enter parameters:
                            </h2>
                            <StyledTextField
                                value={monthData.title}
                                variant="outlined"
                                fullWidth
                                disabled
                                label={'Date'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CalendarTodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <StyledFormControl variant="outlined" fullWidth>
                                <InputLabel>Day of the month</InputLabel>
                                <Select
                                    value={selectedDate}
                                    onChange={handleChange}
                                    label="Day of the month"
                                >
                                    {monthData.labels.map(day => (
                                        <MenuItem value={String(day)} key={day}>
                                            {day}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </StyledFormControl>
                            <StyledTextField
                                value={value}
                                variant="outlined"
                                label={'Summ'}
                                fullWidth
                                type={'number'}
                                onChange={onInputChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <AttachMoneyIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type={'submit'}
                                fullWidth
                                variant={'outlined'}
                            >
                                Add sum by this day <CheckIcon />
                            </Button>
                        </form>
                    </div>
                </Fade>
            </StyledModal>
        </div>
    )
}
