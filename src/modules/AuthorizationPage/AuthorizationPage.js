import '../../styles/modules/AuthorizationPage.css'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import { useAuthorizationPage } from './businessLogic'
import styled, { keyframes } from 'styled-components'
import { bounceIn } from 'react-animations'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { rootURL } from '../../services/rootURL'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import { blue } from '@mui/material/colors'
import { useSpring, animated } from '@react-spring/web'

const Bounce = styled.div`
    animation: 1s ${keyframes`${bounceIn}`};
    width: 100%;
    height: 100%;
`

const StyledButton = styled(Button)`
    && {
        border-radius: 3;
        border: 1px solid black;
        color: black;
        height: 48px;
        padding: 0 30px;
        background-color: ${props =>
            props.theme.colors.backgroundMode} !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
        text-transform: capitalize;
    }
`

const StyledInput = styled(TextField)`
    & label.Mui-focused {
        color: black;
    }
    & label {
        top: -5px;
        left: -5px;
        box-sizing: border-box;
        padding: 5px 9px;
        color: black;
    }
    & .MuiInput-underline:after {
        border-bottom-color: black;
    }
    & .MuiInputLabel-shrink {
        border: 1px solid black;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 1);
    }
    & .MuiOutlinedInput-root {
        background: ${props => props.theme.colors.backgroundMode};
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
        & fieldset {
            border-color: black;
            border-width: 1;
        }
        &:hover fieldset {
            border-color: black;
        }
        &.Mui-focused fieldset {
            border-color: black;
        }
    }
    & label.Mui-error {
        border: 1px solid red;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(5px);
    }
`

function AuthorizationPage() {
    const {
        onPasswordChange,
        alertOpen,
        closeAlert,
        email,
        error,
        onEmailChange,
        onSubmit,
        openAlert,
        password,
        buttonElement,
        forgotPasswordToogle,
        setForgotPassword,
        onToogle,
    } = useAuthorizationPage()
    const moveOut = useSpring({
        width: forgotPasswordToogle ? '70%' : '100%',
        height: forgotPasswordToogle ? '70%' : '100%',
        opacity: forgotPasswordToogle ? 0.0 : 1,
        position: forgotPasswordToogle ? 'relative' : 'static',
        top: forgotPasswordToogle ? '30%' : '0%',
        right: forgotPasswordToogle ? '20%' : '0%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        config: { duration: 700 },
    })
    const moveIn = useSpring({
        width: '100%',
        height: '100%',
        position: 'relative',
        top: forgotPasswordToogle ? '-80%' : '-60%',
        right: forgotPasswordToogle ? '0%' : '20%',
        opacity: forgotPasswordToogle ? 1 : 0,
        display: forgotPasswordToogle ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        config: { duration: 600 },
    })

    const passwordChangeRequest = async e => {
        try {
            const response = await axios.post(rootURL + 'reset-password', {
                email: email,
            })
            if (response.status === 200) {
                setForgotPassword(false)
            } else {
                console.log('something went wrong')
            }
        } catch (error) {
            return error
        }
    }
    return (
        <>
            <div className={`authorization-container`}>
                <Bounce>
                    <animated.form
                        action=""
                        onSubmit={onSubmit}
                        style={moveOut}
                    >
                        {!forgotPasswordToogle && (
                            <h2 className={'authorization-welcome'}>
                                Please, log in to proceed...
                            </h2>
                        )}
                        <StyledInput
                            error={error.email.status}
                            label="Email"
                            type="email"
                            fullWidth
                            autoComplete="current-password"
                            variant="outlined"
                            name={'email'}
                            value={email}
                            disabled={forgotPasswordToogle}
                            onChange={onEmailChange}
                            required
                        />

                        <StyledInput
                            disabled={forgotPasswordToogle}
                            error={error.password.status}
                            label="Password"
                            type="password"
                            fullWidth
                            autoComplete="current-password"
                            variant="outlined"
                            name={'password'}
                            value={password}
                            onChange={onPasswordChange}
                            required
                        />

                        <StyledButton
                            disabled={forgotPasswordToogle}
                            variant="contained"
                            fullWidth
                            className={'enter-button'}
                            type={'submit'}
                            ref={buttonElement}
                            startIcon={
                                <FontAwesomeIcon icon={faRightToBracket} />
                            }
                        >
                            Enter
                        </StyledButton>
                        {!forgotPasswordToogle && (
                            <Button
                                style={{
                                    padding: 0,
                                    color: 'black',
                                }}
                                onClick={onToogle}
                            >
                                Forgot Password?
                            </Button>
                        )}
                    </animated.form>
                    <animated.div style={moveIn}>
                        <Avatar sx={{ bgcolor: blue[500] }}>
                            <LockIcon />
                        </Avatar>
                        <h2 className={'authorization-welcome'}>
                            Enter your email...
                        </h2>
                        <StyledInput
                            error={error.email.status}
                            label="Email"
                            type="email"
                            fullWidth
                            autoComplete="current-password"
                            variant="outlined"
                            name={'email'}
                            value={email}
                            onChange={onEmailChange}
                            required
                        />
                        <StyledButton
                            variant="contained"
                            fullWidth
                            className={'enter-button'}
                            onClick={passwordChangeRequest}
                            ref={buttonElement}
                            startIcon={
                                <FontAwesomeIcon icon={faRightToBracket} />
                            }
                        >
                            send password
                        </StyledButton>
                        <Button
                            onClick={onToogle}
                            style={{
                                padding: 0,
                                color: 'black',
                            }}
                        >
                            Back
                        </Button>
                    </animated.div>
                </Bounce>
                <AlertMessage
                    mainText={"You've not been authorized :("}
                    additionalText={error.email.text || error.password.text}
                    open={alertOpen}
                    handleOpen={openAlert}
                    handleClose={closeAlert}
                    status={false}
                />
            </div>
        </>
    )
}

export default AuthorizationPage
