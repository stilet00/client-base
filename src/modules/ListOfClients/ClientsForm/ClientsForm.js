import { useCallback, useState } from 'react'
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
import { faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DEFAULT_CLIENT } from '../../../constants/constants'
import useModal from '../../../sharedHooks/useModal'
import {
    calculateBalanceDaySum,
    getMiddleValueFromArray,
    getSumFromArray,
    getNumberWithHundredths,
} from '../../../sharedFunctions/sharedFunctions'
import moment from 'moment'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

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

export default function ClientsForm({ translators }) {
    const classes = useStyles()
    const [client, setClient] = useState(DEFAULT_CLIENT)
    const { handleClose, handleOpen, open } = useModal()
    const [personName, setPersonName] = useState([])
    const [siteFilter, setSiteFilter] = useState('svadba')
    const [showPassword, setShowPassword] = useState(false)
    const translatorsNames = translators
        .filter(translator => !translator.suspended.status)
        .map(translator => `${translator.name} ${translator.surname}`)

    const site = {
        name: siteFilter === 'svadba' ? 'svadba' : 'dating',
        login:
            siteFilter === 'svadba' ? client.svadba.login : client.dating.login,
        password:
            siteFilter === 'svadba'
                ? client.svadba.password
                : client.dating.password,
    }

    const handleTranslatorsChange = event => {
        const { value } = event.target
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        )
        setClient({ ...client, translators: personName })
    }

    const handleChange = e => {
        const { name, value } = e.target
        console.log(name, value)
        if (name === `${site.name}.login`) {
            console.log('login works')
            setClient({
                ...client,
                [site.name]: { ...[site.name], login: value },
            })
        } else if (name === `${site.name}.password`) {
            console.log('password works ', name, site.name)
            setClient({
                ...client,
                [site.name]: { ...[site.name], password: value },
            })
        } else {
            setClient({ ...client, [name]: value.trim() })
        }
    }
    const handleRadioChange = e => {
        console.log(e.target.value)
        setSiteFilter(e.target.value)
    }

    function onFormSubmit(e, client) {
        e.preventDefault()
        console.log(client)
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

    return (
        <>
            <Button
                type="button"
                onClick={handleOpen}
                fullWidth
                startIcon={<FontAwesomeIcon icon={faVenus} />}
                className="translators-container__menu-button"
            >
                Add client
            </Button>
            <Modal
                disableEnforceFocus
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
                                    name={'link'}
                                    onChange={handleChange}
                                    value={client.link}
                                    variant="outlined"
                                    label={'instagram'}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <InstagramIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <CssTextField
                                    name={'bank'}
                                    onChange={handleChange}
                                    type="number"
                                    value={client.bank}
                                    variant="outlined"
                                    label={'card'}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CreditScoreIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormLabel className="clients-form__body--label">
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
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        label="translator"
                                        multiple
                                        value={personName}
                                        onChange={handleTranslatorsChange}
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
                                </FormControl>
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
                                            style={{
                                                justifySelf: 'end',
                                                margin: '0',
                                            }}
                                            value="dating"
                                            label="Dating"
                                            control={<Radio />}
                                            onChange={handleRadioChange}
                                        />
                                    </RadioGroup>
                                </FormControl>
                                <CssTextField
                                    name={`${site.name}.login`}
                                    onChange={handleChange}
                                    value={site.login}
                                    variant="outlined"
                                    label={'Login'}
                                    required
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
                                        name={`${site.name}.password`}
                                        onChange={handleChange}
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={site.password}
                                        variant="outlined"
                                        required
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
                                variant={'outlined'}
                                style={{ marginTop: '10px' }}
                            >
                                Add client
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </>
    )
}
