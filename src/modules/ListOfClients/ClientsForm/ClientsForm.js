import { useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import FormLabel from '@mui/material/FormLabel'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import InputAdornment from '@mui/material/InputAdornment'
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
import Checkbox from '@mui/material/Checkbox'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import {
    StyledModal,
    StyledTextField,
} from '../../../sharedComponents/StyledMaterial/styledMaterialComponents'

const regExpForInstagram = /[^a-zа-яё0-9_.]/gi
const regExpForCard = /[^0-9\s]/g
const regExpForEmail = /\S+@\S+\.\S+/

export default function ClientsForm({
    editedClient,
    onAddNewClient,
    onEditClientData,
    clearEditedClient,
    handleClose,
    open,
}) {
    const [client, setClient] = useState(DEFAULT_CLIENT)
    const [siteFilter, setSiteFilter] = useState('svadba')
    const [showPassword, setShowPassword] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const arrayWithErrors = Object.keys(formErrors)
    const arrayOfEditedClientsFields = Object.keys(editedClient)

    console.log(client)

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
    const handleSuspendedStatusChange = e => {
        const { checked } = e.target
        const newState = {
            ...client,
            suspended: !checked,
        }
        setClient(newState)
    }

    async function onFormSubmit(client) {
        if (arrayOfEditedClientsFields.length > 0) {
            await onEditClientData(client)
            clearEditedClient()
        } else {
            await onAddNewClient(client)
        }
        setSiteFilter('svadba')
    }

    function clearClient() {
        console.log('cleaning')
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

    const handleFileInputChange = e => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = event => {
            setClient({ ...client, image: reader.result })
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        if (arrayOfEditedClientsFields.length > 0) {
            setClient(editedClient)
        }
    }, [editedClient, JSON.stringify(arrayOfEditedClientsFields)])

    useEffect(
        () => () => {
            clearClient()
        },
        []
    )

    return (
        <>
            <StyledModal
                disableEnforceFocus
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
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
                        <form>
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
                                <div style={{ gridColumn: '1 / 3' }}>
                                    {client.image === '' ? (
                                        <IconButton
                                            aria-label="upload picture"
                                            component="label"
                                            onChange={handleFileInputChange}
                                        >
                                            <input
                                                hidden
                                                accept="image/jpeg,image/jpg,image/png"
                                                type="file"
                                            />
                                            <PhotoCamera
                                                sx={{
                                                    color: 'black',
                                                }}
                                            />
                                        </IconButton>
                                    ) : (
                                        <Badge
                                            overlap="circular"
                                            sx={{
                                                gridColumn: '1',
                                            }}
                                            badgeContent={
                                                <button
                                                    style={{
                                                        fontSize: '16px',
                                                        color: 'red',
                                                        borderRadius: '50%',
                                                        border: 'none',
                                                    }}
                                                    onClick={e =>
                                                        setClient({
                                                            ...client,
                                                            image: '',
                                                        })
                                                    }
                                                >
                                                    x
                                                </button>
                                            }
                                        >
                                            <Avatar
                                                alt="photo"
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    '& .MuiAvatar-img': {
                                                        objectPosition: 'top',
                                                    },
                                                }}
                                                src={client.image}
                                            />
                                        </Badge>
                                    )}
                                </div>
                                <StyledTextField
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
                                <StyledTextField
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
                                <div className="clients-form__body--big-field media-container">
                                    <StyledTextField
                                        name={'instagramLink'}
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
                                </div>
                                <StyledTextField
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
                                <StyledTextField
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
                                {arrayOfEditedClientsFields.length > 0 && (
                                    <FormControl className="clients-form__body--big-field">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    defaultChecked={
                                                        !client.suspended
                                                    }
                                                />
                                            }
                                            name="suspended"
                                            label="Active"
                                            onChange={
                                                handleSuspendedStatusChange
                                            }
                                        />
                                    </FormControl>
                                )}
                            </div>
                            <Button
                                type={'button'}
                                onClick={async () => {
                                    await onFormSubmit(client)
                                    handleClose()
                                }}
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
            </StyledModal>
        </>
    )
}
