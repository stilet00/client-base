import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import moment from "moment";
import "./ChartForm.css"
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
    // paper: {
    //     backgroundColor: theme.palette.background.paper,
    //     border: '2px solid #000',
    //     boxShadow: theme.shadows[5],
    //     padding: theme.spacing(2, 4, 3),
    // },
}));
const CssTextField = withStyles({
    root: {
        "& .MuiInputBase-root": {
            background: "rgba(80,200,120,0.5)",
        },
    },
})(TextField);

export default function ChartForm({ onMonthSubmit }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState(moment().format("YYYY"));
    const [months, setMonths] = useState(() => {
        let monthsArray = []
        for (let i = 1; i < 13; i++) {
            i < 10 ? monthsArray.push(moment('01-0' + i + "-" + year, 'DD-MM-YYYY').format('MMMM')) :
                monthsArray.push(moment('01-' + i + "-" + year, 'DD-MM-YYYY').format('MMMM'))

        }
        return monthsArray
    });
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

    return (
        <div className={"modal-wrapper"}>
            <Button type="button" onClick={handleOpen} fullWidth>
                <AddIcon />
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
                    <div className={"form-container chart-form"}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                onMonthSubmit({ year: year, month:  selectedMonth, })
                                handleClose();
                            }}
                        >
                            <h2 id="transition-modal-title">Enter parameters:</h2>
                            <CssTextField
                                id="filled-basic"
                                // label="Year"
                                value={year}
                                variant="outlined"
                                fullWidth
                                type={"number"}
                                disabled
                            />
                            <FormControl variant="outlined" className={classes.formControl} fullWidth>
                                <InputLabel id="demo-simple-select-outlined-label">Month</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={selectedMonth}
                                    onChange={handleChange}
                                    label="Month"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        months.map(month => <MenuItem value={month}>{month}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                            <Button type={"submit"} fullWidth variant={"outlined"}>
                                Add chart
                            </Button>

                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
