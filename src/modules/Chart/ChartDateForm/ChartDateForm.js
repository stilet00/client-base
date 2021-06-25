import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import AddBoxIcon from "@material-ui/icons/AddBox";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CheckIcon from '@material-ui/icons/Check';
import "./ChartDateForm.css"
const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
const CssTextField = withStyles({
    root: {
        "& .MuiInputBase-root:first-child": {
            background: "rgba(210,206,206,0.5)",
        },
    },
})(TextField);

export default function ChartDateForm({ monthData }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    // const [months, setMonths] = useState(() => {
    //     let monthsArray = []
    //     for (let i = 1; i < 13; i++) {
    //         i < 10 ? monthsArray.push(moment('01-0' + i + "-" + year, 'DD-MM-YYYY').format('MMMM')) :
    //             monthsArray.push(moment('01-' + i + "-" + year, 'DD-MM-YYYY').format('MMMM'))
    //
    //     }
    //     return monthsArray
    // });
    const [value, setValue] = useState("")
    const [selectedMonth, setSelectedMonth] = useState('');

    const handleChange = (event) => {
        setSelectedMonth(event.target.value);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    function onInputChange(e) {
        setValue(e.target.value)
    }
    return (
        <div className={"modal-wrapper date-wrapper"}>
            <Button type="button" onClick={handleOpen} variant={"outlined"}>
                <AddBoxIcon /><AttachMoneyIcon />
            </Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={"form-container chart-date-form"}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // onMonthSubmit({ year: year, month:  selectedMonth, })
                                handleClose();
                            }}
                        >
                            <h2 id="transition-modal-title">Enter parameters:</h2>
                            <CssTextField
                                value={monthData.datasets[0].label}
                                variant="outlined"
                                fullWidth
                                disabled
                                label={"Date"}
                            />
                            <FormControl variant="outlined" className={classes.formControl} fullWidth>
                                <InputLabel id="demo-simple-select-outlined-label">Month</InputLabel>
                                <Select
                                    value={selectedMonth}
                                    onChange={handleChange}
                                    label="Day of the month"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {/*{*/}
                                    {/*    months.map((month, index) => <MenuItem value={index}>{month}</MenuItem>)*/}
                                    {/*}*/}
                                </Select>
                            </FormControl>
                            <CssTextField
                                value={value}
                                variant="outlined"
                                label={"Summ $"}
                                fullWidth
                                type={"number"}
                                onChange={onInputChange}
                            />
                            <Button type={"submit"} fullWidth variant={"outlined"}>
                                Add sum by this day <CheckIcon />
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
