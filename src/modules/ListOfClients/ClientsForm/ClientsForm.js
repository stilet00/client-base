import { useState, useEffect } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormLabel from '@mui/material/FormLabel'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import InputAdornment from '@material-ui/core/InputAdornment'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import InstagramIcon from '@mui/icons-material/Instagram'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import '../../../styles/modules/ClientsForm.css'
import { DEFAULT_CLIENT } from '../../../constants/constants'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}))

const CssTextField = withStyles({
    root: {
        '& .MuiInputBase-root:first-child': {
            background: 'rgba(210,206,206,0.5)',
        },
    },
})(TextField)

export default function ClientsForm({
    editedClient,
    onAddNewClient,
    onEditClientData,
    clearEditedClient,
    handleClose,
    open,
}) {
    const classes = useStyles()
    const [client, setClient] = useState(DEFAULT_CLIENT)
    const [siteFilter, setSiteFilter] = useState('svadba')
    const [showPassword, setShowPassword] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const arrayWithErrors = Object.keys(formErrors)
    const arrayOfEditedClientsFields = Object.keys(editedClient)
    const regExpForInstagram = /[^a-zа-яё0-9_.]/gi
    const regExpForCard = /[^0-9\s]/g
    const regExpForEmail = /\S+@\S+\.\S+/

    useEffect(() => {
        if (arrayOfEditedClientsFields.length > 0) {
            setClient(editedClient)
        }
    }, [editedClient, JSON.stringify(arrayOfEditedClientsFields)])

    const site = {
        login:
            siteFilter === 'svadba' ? client.svadba.login : client.dating.login,
        password:
            siteFilter === 'svadba'
                ? client.svadba.password
                : client.dating.password,
    }

    const handleFormValidation = (values, key) => {
        const { svadba, dating } = values
        const errors = {}
        const valueIsEmpy = values.length === 0
        switch (key) {
            case 'translators':
                if (valueIsEmpy) {
                    errors[key] = 'empty'
                }
                break
            case 'instagramLink':
                if (valueIsEmpy) {
                    errors[key] = 'instagram link is empty'
                } else if (values[key].length < 5) {
                    errors[key] = 'instagram link is too short'
                }
                break
            case 'bankAccount':
                if (valueIsEmpy) {
                    errors[key] = 'enter credit card number'
                } else if (values[key].length < 19) {
                    errors[key] =
                        'card number have to be at least 16 characters'
                }
                break
            case 'svadba.login':
                if (valueIsEmpy) {
                    errors.login = 'enter login from top-dates'
                } else if (svadba.login.length < 7) {
                    errors.login = 'have to be  7 characters'
                }
                break
            case 'dating.login':
                if (valueIsEmpy) {
                    errors.login = 'enter login for dating.com'
                } else if (!regExpForEmail.test(dating.login)) {
                    errors.login = 'loging for dating  have to look like email'
                }
                break
            case 'dating.password' || 'svadba.password':
                if (dating.password.length < 6) {
                    errors.password = 'password is too short'
                }
                break
            case 'svadba.password':
                if (svadba.password.length < 6) {
                    errors.password = 'password is too short'
                }
                break
            default:
                break
        }
        return errors
    }

    const handleChange = e => {
        const { name, value } = e.target
        if (name === `${siteFilter}.login`) {
            const newState = {
                ...client,
                [siteFilter]: { ...client[siteFilter], login: value },
            }
            setClient(newState)
            setFormErrors(handleFormValidation(newState, name))
        } else if (name === `${siteFilter}.password`) {
            const newState = {
                ...client,
                [siteFilter]: { ...client[siteFilter], password: value },
            }
            setClient(newState)
            setFormErrors(handleFormValidation(newState, name))
        } else {
            const newState = {
                ...client,
                [name]: value,
            }
            setClient(newState)
            setFormErrors(handleFormValidation(newState, name))
        }
    }

    const handleRadioChange = e => {
        setSiteFilter(e.target.value)
    }

    function onFormSubmit(e, client) {
        e.preventDefault()
        if (arrayOfEditedClientsFields.length > 0) {
            onEditClientData(client)
            clearEditedClient()
        } else {
            onAddNewClient(client)
        }
        clearClient()
        handleClose()
        setSiteFilter('svadba')
    }

    function clearClient() {
        setClient(DEFAULT_CLIENT)
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = event => {
        event.preventDefault()
    }

    const handleCardNumberChange = event => {
        const { name, value } = event.target
        function changindValueToCardFormat(value) {
            let arrayFromText = value.split('')
            let textWIthoutSpaces = arrayFromText.filter(el => el !== ' ')
            let fixedArray = textWIthoutSpaces.filter(
                (el, index) => index % 4 === 0 && index !== 0
            )
            if (fixedArray.length === 1) {
                textWIthoutSpaces.splice(4, 0, ' ')
            } else if (fixedArray.length === 2) {
                textWIthoutSpaces.splice(4, 0, ' ')
                textWIthoutSpaces.splice(9, 0, ' ')
            } else if (fixedArray.length === 3) {
                textWIthoutSpaces.splice(4, 0, ' ')
                textWIthoutSpaces.splice(9, 0, ' ')
                textWIthoutSpaces.splice(14, 0, ' ')
            }
            return textWIthoutSpaces.join('')
        }
        const newState = {
            ...client,
            [name]: changindValueToCardFormat(value),
        }
        setClient(newState)

        setFormErrors(handleFormValidation(newState, name))
    }

    const fieldsAreEmpty =
        client.name === '' ||
        client.surname === '' ||
        client.instagramLink === ''
            ? true
            : false

    return (
        <>
            <Modal
                disableEnforceFocus
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={e => {
                    handleClose()
                    clearEditedClient()
                    clearClient()
                    setSiteFilter('svadba')
                    setFormErrors({})
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={'form-container clients-form'}>
                        <form
                            onSubmit={e => {
                                onFormSubmit(e, client)
                                // clearClient()
                                // setTimeout(handleClose, 1100)
                            }}
                        >
                            <h2
                                id="transition-modal-title"
                                className="clients-from__header"
                            >
                                Enter client's data:
                            </h2>
                            <div className="clients-form__body">
                                <FormLabel className="clients-form__body--label">
                                    Primarly information
                                </FormLabel>
                                <CssTextField
                                    name={'name'}
                                    onChange={handleChange}
                                    value={client.name}
                                    variant="outlined"
                                    label={'Name'}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <CssTextField
                                    name={'surname'}
                                    onChange={handleChange}
                                    value={client.surname}
                                    variant="outlined"
                                    label={'Surname'}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AssignmentIndIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <CssTextField
                                    name={'instagramLink'}
                                    className="clients-form__body--big-field"
                                    error={formErrors.instagramLink}
                                    helperText={formErrors.instagramLink}
                                    onChange={handleChange}
                                    value={client.instagramLink.replace(
                                        regExpForInstagram,
                                        ''
                                    )}
                                    variant="outlined"
                                    label={'instagram'}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <InstagramIcon />
                                                </InputAdornment>
                                                <InputAdornment position="start">
                                                    http://instagram.com/
                                                </InputAdornment>
                                            </>
                                        ),
                                    }}
                                />
                                <CssTextField
                                    name={'bankAccount'}
                                    error={formErrors.bankAccount}
                                    helperText={formErrors.bankAccount}
                                    className="clients-form__body--big-field"
                                    onChange={handleCardNumberChange}
                                    value={client.bankAccount.replace(
                                        regExpForCard,
                                        ''
                                    )}
                                    variant="outlined"
                                    label={'card'}
                                    inputProps={{
                                        maxLength: 19,
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CreditScoreIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* we are not addding translators for now here 10.11.2022 */}
                                {/* <FormLabel className="clients-form__body--label">
                                    Additional information
                                </FormLabel>
                                <FormControl
                                    className="clients-form__body--big-field"
                                    sx={{ m: 1 }}
                                >
                                    <InputLabel id="demo-multiple-name-label">
                                        Translators
                                    </InputLabel>
                                    <Select
                                        name="translators"
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        label="translator"
                                        required
                                        error={formErrors.translators}
                                        multiple
                                        value={client.translators}
                                        onChange={handleChange}
                                        input={
                                            <OutlinedInput label="translator" />
                                        }
                                        MenuProps={MenuProps}
                                    >
                                        {translatorsNames.map((name, index) => (
                                            <MenuItem
                                                key={`${name} + ${index}`}
                                                value={name}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> */}
                                <FormLabel className="clients-form__body--label">
                                    Login information
                                </FormLabel>
                                <FormControl className="clients-form__body--big-field">
                                    <FormLabel
                                        id="demo-row-radio-buttons-group-label"
                                        style={{ textAlign: 'left' }}
                                    >
                                        Sites
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        defaultValue="svadba"
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                        }}
                                    >
                                        <FormControlLabel
                                            value="svadba"
                                            control={<Radio />}
                                            label="Svadba"
                                            onChange={handleRadioChange}
                                        />
                                        <FormControlLabel
                                            value="dating"
                                            style={{
                                                justifySelf: 'end',
                                                margin: '0',
                                            }}
                                            label="Dating"
                                            control={<Radio />}
                                            onChange={handleRadioChange}
                                        />
                                    </RadioGroup>
                                </FormControl>
                                <CssTextField
                                    name={`${siteFilter}.login`}
                                    onChange={handleChange}
                                    type={
                                        siteFilter === 'svadba'
                                            ? 'number'
                                            : 'email'
                                    }
                                    error={formErrors.login}
                                    helperText={formErrors.login}
                                    placeholder={
                                        siteFilter === 'svadba'
                                            ? 'Numbers only'
                                            : 'Email like'
                                    }
                                    value={site.login}
                                    variant="outlined"
                                    label={'Login'}
                                    autoComplete="new-password"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormControl>
                                    <InputLabel htmlFor="outlined-adornment-password">
                                        Password
                                    </InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        name={`${siteFilter}.password`}
                                        onChange={handleChange}
                                        error={formErrors.password}
                                        autoComplete="new-password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={site.password}
                                        variant="outlined"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={
                                                        handleClickShowPassword
                                                    }
                                                    onMouseDown={
                                                        handleMouseDownPassword
                                                    }
                                                    edge="end"
                                                >
                                                    {!showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </div>
                            <Button
                                type={'submit'}
                                fullWidth
                                disabled={
                                    fieldsAreEmpty ||
                                    arrayWithErrors.length !== 0
                                }
                                variant={'outlined'}
                                style={{ marginTop: '10px' }}
                            >
                                {arrayOfEditedClientsFields.length > 0
                                    ? 'Edit client'
                                    : 'Add client'}
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </>
    )
}
