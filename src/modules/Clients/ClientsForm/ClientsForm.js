import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import "./ClientsForm.css";
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

export default function ClientsForm({ onMonthSubmit }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [insta, setInsta] = useState('');
    const [onlyFans, setOnlyFans] = useState('');

    // const handleChange = (event) => {
    //     setSelectedMonth(event.target.value);
    // };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div className={"socials add-client-button"}>
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
                    <div className={"form-container clients-form"}>
                        <form >
                            <h2 id="transition-modal-title">Enter parameters:</h2>
                            <CssTextField
                                id="filled-basic"
                                value={name}
                                variant="outlined"
                                label={"Name"}
                                fullWidth
                                required
                            />
                            <CssTextField
                                id="filled-basic"
                                value={name}
                                variant="outlined"
                                label={"Instagram"}
                                fullWidth
                            />
                            <CssTextField
                                id="filled-basic"
                                value={name}
                                variant="outlined"
                                label={"Onlyfans"}
                                fullWidth
                            />

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
