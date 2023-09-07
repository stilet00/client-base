import { styled } from '@mui/system'
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import InputAdornment from '@mui/material/InputAdornment'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import '../../../styles/modules/ClientsForm.css'
import { useClientsForm } from '../businessLogic'
import { faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useWindowDimensions from '../../../sharedHooks/useWindowDimensions'

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root:first-child': {
        background: 'rgba(210,206,206,0.5)',
    },
})

export default function ClientsForm(props) {
    const { screenIsSmall } = useWindowDimensions()

    const {
        handleClose,
        open,
        clearClient,
        client,
        handleOpen,
        onFormSubmit,
        handleChange,
    } = useClientsForm(props)

    return (
        <>
            <Button
                type="button"
                onClick={handleOpen}
                fullWidth={screenIsSmall}
                startIcon={<FontAwesomeIcon icon={faVenus} />}
                className="translators-container__menu-button"
            >
                Add client
            </Button>
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
                    <div className={'form-container clients-form'}>
                        <form
                            onSubmit={e => {
                                onFormSubmit(e, client)
                                clearClient()
                                setTimeout(handleClose, 1100)
                            }}
                            style={{
                                height: 250,
                            }}
                        >
                            <h2 id="transition-modal-title">
                                Enter client's name and surname:
                            </h2>
                            <StyledTextField
                                name={'name'}
                                onChange={handleChange}
                                value={client.name}
                                variant="outlined"
                                label={'Name'}
                                fullWidth
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
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AssignmentIndIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {/*<StyledTextField*/}
                            {/*  name={"instagram"}*/}
                            {/*  onChange={handleChange}*/}
                            {/*  value={client.instagram}*/}
                            {/*  variant="outlined"*/}
                            {/*  label={"Instagram"}*/}
                            {/*  fullWidth*/}
                            {/*  InputProps={{*/}
                            {/*    startAdornment: (*/}
                            {/*      <InputAdornment position="start">*/}
                            {/*        <InstagramIcon />*/}
                            {/*      </InputAdornment>*/}
                            {/*    ),*/}
                            {/*  }}*/}
                            {/*/>*/}
                            {/*<StyledTextField*/}
                            {/*  name={"onlyFans"}*/}
                            {/*  onChange={handleChange}*/}
                            {/*  value={client.onlyFans}*/}
                            {/*  variant="outlined"*/}
                            {/*  label={"Onlyfans"}*/}
                            {/*  fullWidth*/}
                            {/*  InputProps={{*/}
                            {/*    startAdornment: (*/}
                            {/*      <InputAdornment position="start">*/}
                            {/*        <LockIcon />*/}
                            {/*      </InputAdornment>*/}
                            {/*    ),*/}
                            {/*  }}*/}
                            {/*/>*/}
                            {/*<div className={"upload-container"}>*/}
                            {/*  <input*/}
                            {/*    type="file"*/}
                            {/*    ref={fileInput}*/}
                            {/*    accept={"image/jpeg,image/png,image/gif"}*/}
                            {/*    className={"photo-input"}*/}
                            {/*    onChange={() => createThumbnail(fileInput.current.files[0])}*/}
                            {/*    name={"image"}*/}
                            {/*  />*/}
                            {/*  <ImageIcon fontSize={"large"} className={"photo-icon"} />*/}
                            {/*</div>*/}
                            {/*{previewImage}*/}
                            <Button
                                type={'submit'}
                                fullWidth
                                variant={'outlined'}
                            >
                                Add client
                            </Button>
                        </form>
                    </div>
                </Fade>
            </StyledModal>
        </>
    )
}
