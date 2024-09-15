import { useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../../styles/modules/AuthorizationPage.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { useAuthorizationPage } from "./businessLogic";
import styled, { keyframes } from "styled-components";
import { bounceIn } from "react-animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Avatar from "@mui/material/Avatar";
import LockIcon from "@mui/icons-material/Lock";
import { blue } from "@mui/material/colors";

const Bounce = styled.div`
    animation: 1s ${keyframes`${bounceIn}`};
    width: 100%;
    height: 100%;
`;

const LinkButton = styled(Button)`
    padding: 0;
    color: black !important;
    &:hover {
        text-decoration: underline !important;
    }
`;

const StyledButton = styled(Button)`
    && {
        border-radius: 3;
        border: 1px solid black;
        color: black;
        height: 48px;
        padding: 0 30px;
        background-color: ${(props) => props.theme.colors.backgroundMode} !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
        text-transform: capitalize;
    }
`;

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
        background: ${(props) => props.theme.colors.backgroundMode};
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
`;

function AuthorizationPage() {
	const {
		onPasswordChange,
		alertOpen,
		closeAlert,
		email,
		error,
		onEmailChange,
		handleSignIn,
		openAlert,
		password,
		buttonElement,
		forgotPasswordToogle,
		onToogle,
		changePasswordRequestHasBeenSent,
		handleForgotPassword,
	} = useAuthorizationPage();

	const loginRef = useRef(null);
	const forgotPasswordRef = useRef(null);
	const nodeRef = forgotPasswordToogle ? forgotPasswordRef : loginRef;
	return (
		<>
			<div className={`authorization-container`}>
				<Bounce>
					<SwitchTransition mode={"out-in"}>
						<CSSTransition
							key={forgotPasswordToogle}
							nodeRef={nodeRef}
							timeout={500}
							classNames="fade"
						>
							<form ref={nodeRef}>
								{forgotPasswordToogle ? (
									<>
										<Avatar sx={{ bgcolor: blue[500] }}>
											<LockIcon />
										</Avatar>
										{!changePasswordRequestHasBeenSent && (
											<>
												<h2 className={"authorization-welcome"}>
													Enter your email...
												</h2>
												<StyledInput
													error={error.email.status}
													label="Email"
													type="email"
													fullWidth
													autoComplete="current-password"
													variant="outlined"
													name={"email"}
													value={email}
													onChange={onEmailChange}
													required
												/>
												<StyledButton
													variant="contained"
													fullWidth
													className={"enter-button"}
													onClick={handleForgotPassword}
													ref={buttonElement}
													startIcon={
														<FontAwesomeIcon icon={faRightToBracket} />
													}
												>
													Send password
												</StyledButton>
											</>
										)}
										{changePasswordRequestHasBeenSent && (
											<h2 className={"authorization-password-sent"}>
												If user exists, you will receive password-reset link
											</h2>
										)}
										<LinkButton onClick={onToogle}>Back</LinkButton>
									</>
								) : (
									<>
										<h2 className={"authorization-welcome"}>
											Please, log in to proceed...
										</h2>
										<StyledInput
											error={error.email.status}
											helperText={error.email.text}
											label="Email"
											type="email"
											fullWidth
											autoComplete="current-password"
											variant="outlined"
											name={"email"}
											value={email}
											disabled={forgotPasswordToogle}
											onChange={onEmailChange}
											required
										/>

										<StyledInput
											disabled={forgotPasswordToogle}
											error={error.password.status}
											helperText={error.password.text}
											label="Password"
											type="password"
											fullWidth
											autoComplete="current-password"
											variant="outlined"
											name={"password"}
											value={password}
											onChange={onPasswordChange}
											required
										/>

										<StyledButton
											disabled={forgotPasswordToogle}
											variant="contained"
											fullWidth
											className={"enter-button"}
											type={"button"}
											onClick={handleSignIn}
											ref={buttonElement}
											startIcon={<FontAwesomeIcon icon={faRightToBracket} />}
										>
											Enter
										</StyledButton>
										<LinkButton onClick={onToogle}>Forgot Password?</LinkButton>
									</>
								)}
							</form>
						</CSSTransition>
					</SwitchTransition>
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
	);
}

export default AuthorizationPage;
