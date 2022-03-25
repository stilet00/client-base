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
import { DEFAULT_DAY_BALANCE, DEFAULT_TRANSLATOR } from "../../../constants/constants";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import useModal from "../../../sharedHooks/useModal";
import FormControl from "@material-ui/core/FormControl";
import DraftsIcon from "@material-ui/icons/Drafts";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import moment from "moment";

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

export default function EditBalanceForm(client) {
    const classes = useStyles();

    const { open, handleOpen, handleClose } = useModal();

    const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));

    const [selectedMonth, setSelectedMonth] = useState(moment().format("M"));

    const [selectedDay, setSelectedDay] = useState(moment().format("D"));

    const [currentBalanceDay, setCurrentBalanceDay] = useState(findTodayBalance());

    console.log(currentBalanceDay);

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
            setTranslator({ ...translator, [e.target.name]: e.target.value.trim() });
        },
        [translator]
    );

    function getDaySumm() {
        return currentBalanceDay.chats + currentBalanceDay.letters + currentBalanceDay.datingChats + currentBalanceDay.datingLetters + currentBalanceDay.virtualGifts + currentBalanceDay.photoAttachments - currentBalanceDay.penalties
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
                                <label htmlFor="Year">Year</label>
                                <select value={selectedYear} onChange={handleYear} disabled id={"Year"}>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                </select>
                                <label htmlFor="Month">Month</label>
                                <select value={selectedMonth} onChange={handleMonth} id={"Month"}>
                                    {
                                        findYear().months.map((item, index) => <option value={index+1}>{ moment(index+1, "M").format("MMMM") }</option>)
                                    }
                                </select>
                                <label htmlFor="Day">Day</label>
                                <select value={selectedDay} onChange={handleDay} id={"Day"}>
                                    {
                                        findMonth().map((item, index) => <option value={index+1}>{ moment(index+1, "D").format("DD") }</option>)
                                    }
                                </select>
                            </div>
                            <p>Finances:</p>
                            <div className="balance-form__finances">
                                <div className="balance-form__finances__svadba">
                                    <div className="balance-form__finances-input">
                                        <CssTextField
                                            name={"chats"}
                                            onChange={handleChange}
                                            value={currentBalanceDay.chats}
                                            variant="outlined"
                                            label={"Chats"}
                                            type={"number"}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
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
                                            value={currentBalanceDay.letters}
                                            variant="outlined"
                                            label={"Letters"}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
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
                                            value={currentBalanceDay.virtualGifts}
                                            variant="outlined"
                                            label={"Virtual gifts"}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
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
                                            value={currentBalanceDay.photoAttachments}
                                            variant="outlined"
                                            label={"Photo attachments"}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
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
                                            value={currentBalanceDay.datingChats}
                                            variant="outlined"
                                            label={"Dating chats"}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
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
                                            value={currentBalanceDay.datingLetters}
                                            variant="outlined"
                                            label={"Dating letters"}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
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
                                        value={currentBalanceDay.penalties}
                                        variant="outlined"
                                        label={"Penalties"}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MoneyOffIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                            </div>
                            <p>Day balance:{ getDaySumm() }</p>
                            <div className="balance-form__balance">
                            </div>
                            {/*<Button type={"submit"} fullWidth variant={"outlined"}>*/}
                            {/*    Add translator*/}
                            {/*</Button>*/}
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
