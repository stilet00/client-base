import React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ForumIcon from '@mui/icons-material/Forum'
import InputAdornment from '@mui/material/InputAdornment'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import MicIcon from '@mui/icons-material/Mic'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import '../../../styles/modules/EditBalanceForm.css'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import CloseIcon from '@mui/icons-material/Close'
import DraftsIcon from '@mui/icons-material/Drafts'
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import moment from 'moment'
import InputLabel from '@mui/material/InputLabel'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import { useBalanceForm } from '../businessLogic'
import { calculateBalanceDaySum } from '../../../sharedFunctions/sharedFunctions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { faMoneyBill1Wave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { blue, green, red } from '@mui/material/colors'
import {
    SUNRISE_AGENCY_ID,
    arrayOfYearsForSelectFilter,
} from 'constants/constants'
import {
    StyledModal,
    StyledFormControl,
} from 'sharedComponents/StyledMaterial/styledMaterialComponents'
import AlertMessage from 'sharedComponents/AlertMessage/AlertMessage'
import Loader from 'sharedComponents/Loader/Loader'

export default function EditBalanceForm({
    name,
    surname,
    clients,
    admin,
    translatorId,
    updateBalanceDayIsLoading,
}) {
    const {
        handleOpen,
        open,
        handleClose,
        selectedYear,
        handleYearChange,
        selectedMonth,
        handleMonthChange,
        selectedDay,
        handleDayChange,
        selectedClient,
        handleClientChange,
        handleChange,
        messageFromBalanceDayForm,
        alertOpen,
        openAlert,
        closeAlert,
        currentBalanceDay,
        balanceDaySubmit,
    } = useBalanceForm({
        clients,
        translatorId,
    })
    const voiceMessageCheck = () => currentBalanceDay?.voiceMessages ?? 0
    const currentBalanceDayStatistics = currentBalanceDay?.statistics
    return (
        <>
            <Button
                sx={{
                    color: 'white',
                    backgroundColor: blue[500],
                    '&:hover': {
                        backgroundColor: blue[700],
                    },
                }}
                type="button"
                size={'small'}
                variant={'contained'}
                onClick={handleOpen}
                startIcon={<FontAwesomeIcon icon={faMoneyBill1Wave} />}
            >
                {admin ? 'Edit balance' : 'Show Balance'}
            </Button>
            {open && (
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
                        <div
                            className={
                                'form-container balance-form gradient-box'
                            }
                        >
                            <form>
                                <h2 id="transition-modal-title">
                                    {name + ' ' + surname}
                                </h2>
                                <div className={'balance-form__date'}>
                                    <Accordion
                                        className={
                                            'balance-form__date__accordion'
                                        }
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Date filter</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <StyledFormControl variant="outlined">
                                                <InputLabel>Year</InputLabel>
                                                <Select
                                                    value={selectedYear}
                                                    onChange={handleYearChange}
                                                    label="Year"
                                                >
                                                    {arrayOfYearsForSelectFilter?.map(
                                                        (year, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                value={year}
                                                            >
                                                                {year}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </StyledFormControl>
                                            <StyledFormControl variant="outlined">
                                                <InputLabel htmlFor={'Month'}>
                                                    Month
                                                </InputLabel>
                                                <Select
                                                    value={selectedMonth}
                                                    onChange={handleMonthChange}
                                                    label="Month"
                                                >
                                                    {Array.from(
                                                        { length: 12 },
                                                        (_, index) => (
                                                            <MenuItem
                                                                value={
                                                                    index + 1
                                                                }
                                                                key={index}
                                                            >
                                                                {moment(
                                                                    index + 1,
                                                                    'M'
                                                                ).format(
                                                                    'MMMM'
                                                                )}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </StyledFormControl>
                                            <StyledFormControl variant="outlined">
                                                <InputLabel htmlFor={'Day'}>
                                                    Day
                                                </InputLabel>
                                                <Select
                                                    value={selectedDay}
                                                    onChange={handleDayChange}
                                                    label="Day"
                                                >
                                                    {Array.from(
                                                        {
                                                            length: moment().daysInMonth(),
                                                        },
                                                        (_, index) => (
                                                            <MenuItem
                                                                value={String(
                                                                    index + 1
                                                                )}
                                                                key={index}
                                                            >
                                                                {index + 1}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </StyledFormControl>
                                        </AccordionDetails>
                                    </Accordion>
                                    <StyledFormControl variant="outlined">
                                        <InputLabel>Client</InputLabel>
                                        <Select
                                            value={selectedClient}
                                            onChange={handleClientChange}
                                            label="Client"
                                            style={{
                                                height: 40,
                                            }}
                                        >
                                            {clients
                                                .filter(
                                                    client => !client.suspended
                                                )
                                                ?.map(item => (
                                                    <MenuItem
                                                        value={item._id}
                                                        key={item._id}
                                                    >
                                                        {`${item.name} ${item.surname}`}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </StyledFormControl>
                                </div>
                                {updateBalanceDayIsLoading && (
                                    <Loader
                                        style={{
                                            color: 'black',
                                            margin: '0 auto',
                                        }}
                                        loaderColor={`black`}
                                    />
                                )}
                                {!updateBalanceDayIsLoading && (
                                    <>
                                        <p>Finances:</p>
                                        <div className="balance-form__finances">
                                            {translatorId !==
                                            SUNRISE_AGENCY_ID ? (
                                                <>
                                                    <div className="balance-form__finances__svadba">
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={'chats'}
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.chats
                                                                }
                                                                variant="outlined"
                                                                label={'Chats'}
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                disabled={
                                                                    !admin
                                                                }
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <ForumIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={'letters'}
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.letters
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                                label={
                                                                    'Letters'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                disabled={
                                                                    !admin
                                                                }
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <DraftsIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={
                                                                    'virtualGiftsSvadba'
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.virtualGiftsSvadba
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                                label={
                                                                    'Virtual gifts'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                disabled={
                                                                    !admin
                                                                }
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <CardGiftcardIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={
                                                                    'photoAttachments'
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    findClientById()
                                                                        ?.photoAttachments
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                                label={
                                                                    'Attachments'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                disabled={
                                                                    !admin
                                                                }
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <AddAPhotoIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={
                                                                    'penalties'
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.penalties
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                                label={
                                                                    'Penalties'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                disabled={
                                                                    !admin
                                                                }
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <MoneyOffIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="balance-form__finances__dating">
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={'dating'}
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.dating
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                                label={'Dating'}
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                disabled={
                                                                    !admin
                                                                }
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <FavoriteIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={
                                                                    'phoneCalls'
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.phoneCalls
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                                label={
                                                                    'Phone calls'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                disabled={
                                                                    !admin
                                                                }
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <PhoneCallbackIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={
                                                                    'virtualGiftsDating'
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.virtualGiftsDating
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                                label={
                                                                    'Virtual gifts dating'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                disabled={
                                                                    !admin
                                                                }
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <CardGiftcardIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={
                                                                    'voiceMessages'
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={voiceMessageCheck()}
                                                                size="small"
                                                                disabled={
                                                                    !admin
                                                                }
                                                                variant="outlined"
                                                                label={
                                                                    'Voice Messages'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <MicIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        {admin && (
                                                            <Accordion
                                                                className={
                                                                    'balance-form__finances--accordion'
                                                                }
                                                            >
                                                                <AccordionSummary
                                                                    expandIcon={
                                                                        <ExpandMoreIcon />
                                                                    }
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                >
                                                                    <Typography>
                                                                        Comments
                                                                    </Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <TextField
                                                                        id="outlined-multiline-flexible"
                                                                        label={
                                                                            'Edit here'
                                                                        }
                                                                        name={
                                                                            'comments'
                                                                        }
                                                                        type={
                                                                            'text'
                                                                        }
                                                                        multiline
                                                                        fullWidth
                                                                        size="small"
                                                                        maxRows={
                                                                            4
                                                                        }
                                                                        disabled={
                                                                            !admin
                                                                        }
                                                                        value={
                                                                            currentBalanceDayStatistics.comments ||
                                                                            ''
                                                                        }
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        InputProps={{
                                                                            endAdornment:
                                                                                (
                                                                                    <InputAdornment position="end">
                                                                                        <ContactSupportIcon />
                                                                                    </InputAdornment>
                                                                                ),
                                                                        }}
                                                                    />
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="balance-form__finances__svadba">
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={
                                                                    'penalties'
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.penalties
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                                label={
                                                                    'Penalties'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <MoneyOffIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={'letters'}
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.letters
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                                label={
                                                                    'Letters'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                disabled={
                                                                    !admin
                                                                }
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <DraftsIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="balance-form__finances__dating">
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={
                                                                    'photoAttachments'
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.photoAttachments
                                                                }
                                                                size="small"
                                                                disabled={
                                                                    !admin
                                                                }
                                                                variant="outlined"
                                                                label={
                                                                    'Photo attachments'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <AddPhotoAlternateIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="balance-form__finances-input">
                                                            <TextField
                                                                name={'chats'}
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onClick={e =>
                                                                    e.target.select()
                                                                }
                                                                value={
                                                                    currentBalanceDayStatistics.chats
                                                                }
                                                                variant="outlined"
                                                                label={
                                                                    'Video Reviews'
                                                                }
                                                                type={'number'}
                                                                step="0.01"
                                                                fullWidth
                                                                required
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment:
                                                                        (
                                                                            <InputAdornment position="end">
                                                                                <ForumIcon />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                            <Accordion
                                                                className={
                                                                    'balance-form__finances--accordion'
                                                                }
                                                            >
                                                                <AccordionSummary
                                                                    expandIcon={
                                                                        <ExpandMoreIcon />
                                                                    }
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                >
                                                                    <Typography>
                                                                        Comments
                                                                    </Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <TextField
                                                                        id="outlined-multiline-flexible"
                                                                        label={
                                                                            'Edit here'
                                                                        }
                                                                        name={
                                                                            'comments'
                                                                        }
                                                                        type={
                                                                            'text'
                                                                        }
                                                                        multiline
                                                                        fullWidth
                                                                        size="small"
                                                                        maxRows={
                                                                            4
                                                                        }
                                                                        value={
                                                                            currentBalanceDayStatistics.comments ||
                                                                            ''
                                                                        }
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        InputProps={{
                                                                            endAdornment:
                                                                                (
                                                                                    <InputAdornment position="end">
                                                                                        <ContactSupportIcon />
                                                                                    </InputAdornment>
                                                                                ),
                                                                        }}
                                                                    />
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <p
                                            style={{
                                                margin: '0 8px',
                                            }}
                                        >
                                            <strong>Day balance: </strong>
                                            {calculateBalanceDaySum(
                                                currentBalanceDay.statistics
                                            ).toFixed(2) + ' $'}
                                        </p>
                                        {currentBalanceDayStatistics.comments ? (
                                            <p
                                                style={{
                                                    margin: '0 8px',
                                                }}
                                            >
                                                <strong>Day comment: </strong>
                                                {` ${currentBalanceDayStatistics.comments}.`}
                                            </p>
                                        ) : null}
                                        <div className="balance-form__actions">
                                            {admin && (
                                                <Button
                                                    variant={'outlined'}
                                                    type={'button'}
                                                    onClick={async () =>
                                                        balanceDaySubmit({
                                                            currentBalanceDay,
                                                        })
                                                    }
                                                    disabled={!admin}
                                                    className={
                                                        'balance-form__actions--button'
                                                    }
                                                    sx={{
                                                        color: 'white',
                                                        backgroundColor:
                                                            green[500],
                                                        '&:hover': {
                                                            backgroundColor:
                                                                green[700],
                                                        },
                                                    }}
                                                    startIcon={<SaveAsIcon />}
                                                >
                                                    Save
                                                </Button>
                                            )}
                                            <Button
                                                type={'button'}
                                                variant={'outlined'}
                                                sx={{
                                                    color: 'white',
                                                    backgroundColor: red[500],
                                                    '&:hover': {
                                                        backgroundColor:
                                                            red[700],
                                                    },
                                                }}
                                                onClick={handleClose}
                                                className={
                                                    'balance-form__actions--button'
                                                }
                                                startIcon={<CloseIcon />}
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </Fade>
                </StyledModal>
            )}
            <AlertMessage
                mainText={messageFromBalanceDayForm.text}
                open={alertOpen}
                handleOpen={openAlert}
                handleClose={closeAlert}
                status={messageFromBalanceDayForm.status}
            />
        </>
    )
}
