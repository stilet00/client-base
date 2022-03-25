import React, { useCallback, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ForumIcon from "@material-ui/icons/Forum";
import InputAdornment from "@material-ui/core/InputAdornment";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import "../../../styles/modules/EditBalanceForm.css";
import { DEFAULT_DAY_BALANCE } from "../../../constants/constants";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import useModal from "../../../sharedHooks/useModal";
import FormControl from "@material-ui/core/FormControl";
import DraftsIcon from "@material-ui/icons/Drafts";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
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

export default function EditBalanceForm({ client, balanceDaySubmit }) {
    const classes = useStyles();

    const { open, handleOpen, handleClose } = useModal();

    const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));

    const [selectedMonth, setSelectedMonth] = useState(moment().format("M"));

    const [selectedDay, setSelectedDay] = useState(moment().format("D"));

    const [currentBalanceDay, setCurrentBalanceDay] = useState(findTodayBalance());

    function findYear() {
        return client.balanceByYears.find(item => item.year === selectedYear);
    }

    function findMonth() {
        return findYear().months.find((item, index) => index + 1 === Number(selectedMonth))
    }

    function findTodayBalance() {
        return findMonth().find((item, index) => index + 1 === Number(selectedDay))
    }

    useEffect(() => {
        setCurrentBalanceDay(findTodayBalance());
    }, [selectedYear, selectedMonth, selectedDay])

    const handleYear = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleMonth = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleDay = (event) => {
        setSelectedDay(event.target.value);
    };

    const getTotalDays = useCallback(() => {
        const stringMonth = selectedMonth < 9 ? "0" + selectedMonth : selectedMonth;
        let totalDays = [];
        for (
            let i = 1;
            i <= moment(selectedYear + "-" + stringMonth, "YYYY-MM").daysInMonth();
            i++
        ) {
            totalDays.push(i);
        }
        return totalDays;
    }, []);


    const handleChange = useCallback(
        (e) => {
            setCurrentBalanceDay({ ...currentBalanceDay, [e.target.name]: Number(e.target.value.trim()) })
        },
        [currentBalanceDay]
    );

    function getDaySumm() {
        return currentBalanceDay.chats + currentBalanceDay.letters + currentBalanceDay.datingChats + currentBalanceDay.datingLetters + currentBalanceDay.virtualGifts + currentBalanceDay.photoAttachments - currentBalanceDay.penalties
    }

    function onSavePressed() {
        balanceDaySubmit(currentBalanceDay);
    }

    return (
        <div className={""}>
            <Button
                type="button"
                onClick={handleOpen}
                variant={"outlined"}
            >
                <AttachMoneyIcon />
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
                    <div className={"form-container balance-form"}>
                        <form
                        >
                            <h2 id="transition-modal-title">
                                Statistics on { client.name + " " + client.surname }
                            </h2>
                            <p>Date:</p>
                            <div className={"balance-form__date"}>
                                <FormControl
                                    variant="outlined"
                                    className={classes.formControl}
                                >
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={selectedYear}
                                        onChange={handleYear}
                                        label="Year"
                                        disabled
                                    >
                                        <MenuItem value={selectedYear}>
                                            {selectedYear}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl
                                    variant="outlined"
                                    className={classes.formControl}
                                >
                                    <InputLabel htmlFor={"Month"}>Month</InputLabel>
                                    <Select
                                        value={selectedMonth}
                                        onChange={handleMonth}
                                        label="Month"
                                    >
                                        {
                                            findYear().months.map((item, index) => <MenuItem value={index+1} key={index}>{ moment(index+1, "M").format("MMMM") }</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                                <FormControl
                                    variant="outlined"
                                    className={classes.formControl}
                                >
                                    <InputLabel htmlFor={"Day"}>Day</InputLabel>
                                    <Select
                                        value={selectedDay}
                                        onChange={handleDay}
                                        label="Day"
                                    >
                                    {
                                        findMonth().map((item, index) => <MenuItem value={index+1}>{ moment(index+1, "D").format("DD") }</MenuItem>)
                                    }
                                    </Select>
                                </FormControl>
                            </div>
                            <p>Finances:</p>
                            <div className="balance-form__finances">
                                <div className="balance-form__finances__svadba">
                                    <div className="balance-form__finances-input">
                                        <CssTextField
                                            name={"chats"}
                                            onChange={handleChange}
                                            onClick={(e) => e.target.select()}
                                            value={currentBalanceDay.chats}
                                            variant="outlined"
                                            label={"Chats"}
                                            type={"number"}
                                            step="0.01"
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <ForumIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                    <div className="balance-form__finances-input">
                                        <CssTextField
                                            name={"letters"}
                                            onChange={handleChange}
                                            onClick={(e) => e.target.select()}
                                            value={currentBalanceDay.letters}
                                            variant="outlined"
                                            label={"Letters"}
                                            type={"number"}
                                            step="0.01"
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <DraftsIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                    <div className="balance-form__finances-input">
                                        <CssTextField
                                            name={"virtualGifts"}
                                            onChange={handleChange}
                                            onClick={(e) => e.target.select()}
                                            value={currentBalanceDay.virtualGifts}
                                            variant="outlined"
                                            label={"Virtual gifts"}
                                            type={"number"}
                                            step="0.01"
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <CardGiftcardIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                    <div className="balance-form__finances-input">
                                        <CssTextField
                                            name={"photoAttachments"}
                                            onChange={handleChange}
                                            onClick={(e) => e.target.select()}
                                            value={currentBalanceDay.photoAttachments}
                                            variant="outlined"
                                            label={"Photo attachments"}
                                            type={"number"}
                                            step="0.01"
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <CameraAltIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="balance-form__finances__dating">
                                    <div className="balance-form__finances-input">
                                        <CssTextField
                                            name={"datingChats"}
                                            onChange={handleChange}
                                            onClick={(e) => e.target.select()}
                                            value={currentBalanceDay.datingChats}
                                            variant="outlined"
                                            label={"Dating chats"}
                                            type={"number"}
                                            step="0.01"
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <ForumIcon /> Dating
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                    <div className="balance-form__finances-input">
                                        <CssTextField
                                            name={"datingLetters"}
                                            onChange={handleChange}
                                            onClick={(e) => e.target.select()}
                                            value={currentBalanceDay.datingLetters}
                                            variant="outlined"
                                            label={"Dating letters"}
                                            type={"number"}
                                            step="0.01"
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <DraftsIcon /> Dating
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="balance-form__finances-input">
                                    <CssTextField
                                        name={"penalties"}
                                        onChange={handleChange}
                                        onClick={(e) => e.target.select()}
                                        value={currentBalanceDay.penalties}
                                        variant="outlined"
                                        label={"Penalties"}
                                        type={"number"}
                                        step="0.01"
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <MoneyOffIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                </div>
                            </div>
                            <p>Day balance:{ getDaySumm().toFixed(2) }</p>
                            <div className="balance-form__balance">
                            </div>
                            <Button type={"button"} variant={"outlined"} onClick={onSavePressed}>
                                Save changes
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}