import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import LoggedOutPage from '../AuthorizationPage/LoggedOutPage/LoggedOutPage'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import TranslatorsForm from './TranslatorsForm/TranslatorsForm'
import SingleTranslator from './SingleTranslator/SingleTranslator'
import '../../styles/modules/Translators.css'
import ClientsForm from '../Clients/ClientsForm/ClientsForm'
import Loader from '../../sharedComponents/Loader/Loader'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import { useTranslators, useSingleTranslator } from './businessLogic'
import AlertMessageConfirmation from '../../sharedComponents/AlertMessageConfirmation/AlertMessageConfirmation'
import moment from 'moment/moment'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ClientsList from '../Clients/ClientsList/ClientsList'
import { Checkbox, Divider, TextField } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers'
import { DEFAULT_CATEGORIES } from '../../constants/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPiggyBank, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import useWindowDimensions from '../../sharedHooks/useWindowDimensions'
import { useAdminStatus } from '../../sharedHooks/useAdminStatus'
import styled from 'styled-components'

const StyledButton = styled(Button)`
    && {
        color: black;
    }
`
function Translators() {
    const user = useSelector(state => state.auth.user)
    const { screenIsSmall } = useWindowDimensions()
    const {
        translators,
        clients,
        dragLeaveHandler,
        dragOverHandler,
        loading,
        onBoardDrop,
        state,
        toggleDrawer,
        openAlert,
        closeAlert,
        alertOpen,
        clientsFormSubmit,
        deleteClient,
        dragDropHandler,
        dragEndHandler,
        dragStartHandler,
        message,
        translatorsFormSubmit,
        balanceDaySubmit,
        alertStatusConfirmation,
        openAlertConfirmation,
        closeAlertConfirmationNoReload,
        calculateMonthTotal,
        suspendTranslator,
        suspendClient,
        changeFilter,
        memoizedFilteredTranslators,
        translatorFilter,
        addPersonalPenaltyToTranslator,
        updateTranslatorEmail,
        sendNotificationEmails,
        mailoutInProgress,
        dollarToUahRate,
    } = useTranslators(user)
    const { getBonusesForChats, chatsBonus } = useSingleTranslator(user)
    const { isAdmin } = useAdminStatus(user)
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined
    useEffect(() => {
        getBonusesForChats(translatorFilter.date, 'chats')
    }, [user, translatorFilter.date])
    return user ? (
        <div className={'gallery-container'}>
            {screenIsSmall ? (
                <div className="gallery-menu gallery-menu_no-border">
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Menu</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ClientsList
                                clients={clients}
                                toggleDrawer={toggleDrawer}
                                state={state}
                                dragStartHandler={dragStartHandler}
                                dragOverHandler={dragOverHandler}
                                dragLeaveHandler={dragLeaveHandler}
                                dragEndHandler={dragEndHandler}
                                dragDropHandler={dragDropHandler}
                                deleteClient={deleteClient}
                                translators={translators}
                            />
                            {isAdmin && (
                                <>
                                    <ClientsForm
                                        onFormSubmit={clientsFormSubmit}
                                    />
                                    <TranslatorsForm
                                        onFormSubmit={translatorsFormSubmit}
                                    />
                                    <StyledButton
                                        aria-describedby={id}
                                        onClick={openAlertConfirmation}
                                        fullWidth={screenIsSmall}
                                        disabled={!isAdmin}
                                        className="translators-container__menu-button"
                                        startIcon={
                                            <FontAwesomeIcon
                                                icon={faPaperPlane}
                                            />
                                        }
                                    >
                                        Send emails
                                    </StyledButton>
                                </>
                            )}
                            <StyledButton
                                aria-describedby={id}
                                onClick={handleClick}
                                fullWidth={screenIsSmall}
                                startIcon={
                                    <FontAwesomeIcon icon={faPiggyBank} />
                                }
                            >
                                Show total
                            </StyledButton>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                className={'sum-popover'}
                            >
                                <Typography sx={{ p: 2 }} align={'left'}>
                                    {`Dating total: `}
                                    <b>{`${calculateMonthTotal(
                                        DEFAULT_CATEGORIES.dating
                                    )} $`}</b>
                                </Typography>
                                <Typography sx={{ p: 2 }} align={'left'}>
                                    {`Gifts svadba: `}
                                    <b>{`${calculateMonthTotal(
                                        DEFAULT_CATEGORIES.virtualGiftsSvadba
                                    )} $`}</b>
                                </Typography>
                                <Typography sx={{ p: 2 }} align={'left'}>
                                    {`Gifts dating: `}
                                    <b>{`${calculateMonthTotal(
                                        DEFAULT_CATEGORIES.virtualGiftsDating
                                    )} $`}</b>
                                </Typography>
                                <Typography sx={{ p: 2 }} align={'left'}>
                                    {`Phone calls: `}
                                    <b>{`${calculateMonthTotal(
                                        DEFAULT_CATEGORIES.phoneCalls
                                    )} $`}</b>
                                </Typography>
                                <Typography sx={{ p: 2 }} align={'left'}>
                                    {`Chats total: `}
                                    <b>{`${calculateMonthTotal(
                                        DEFAULT_CATEGORIES.chats
                                    )} $`}</b>
                                </Typography>
                                <Typography sx={{ p: 2 }} align={'left'}>
                                    {`Letters total: `}
                                    <b>{`${calculateMonthTotal(
                                        DEFAULT_CATEGORIES.letters
                                    )} $`}</b>
                                </Typography>
                                <Typography sx={{ p: 2 }} align={'left'}>
                                    {`Penalties: `}
                                    <b>{`${calculateMonthTotal(
                                        DEFAULT_CATEGORIES.penalties
                                    )} $`}</b>
                                </Typography>
                                <Divider />
                                <Typography sx={{ p: 2 }} align={'left'}>
                                    {`Total by ${moment().format('D MMMM')}: `}{' '}
                                    <b>
                                        <b>{`${calculateMonthTotal().toFixed(
                                            2
                                        )} $`}</b>
                                    </b>
                                </Typography>
                            </Popover>
                            <div className="gallery-menu__filters">
                                <div
                                    className={
                                        'gallery-menu__checkbox-container'
                                    }
                                >
                                    <Checkbox
                                        defaultChecked
                                        name={'suspended'}
                                        onChange={changeFilter}
                                        disabled={!isAdmin}
                                    />
                                    Hide suspended
                                </div>
                                <div className="gallery-menu__date-container">
                                    <MobileDatePicker
                                        label="Balance date"
                                        value={translatorFilter.date}
                                        name={'date'}
                                        onChange={changeFilter}
                                        disabled={!isAdmin}
                                        renderInput={params => (
                                            <TextField {...params} />
                                        )}
                                    />
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            ) : (
                <div className="bigScreen-translator-menu">
                    <ClientsList
                        clients={clients}
                        toggleDrawer={toggleDrawer}
                        state={state}
                        dragStartHandler={dragStartHandler}
                        dragOverHandler={dragOverHandler}
                        dragLeaveHandler={dragLeaveHandler}
                        dragEndHandler={dragEndHandler}
                        dragDropHandler={dragDropHandler}
                        deleteClient={deleteClient}
                        translators={translators}
                    />
                    {isAdmin && (
                        <>
                            <ClientsForm onFormSubmit={clientsFormSubmit} />
                            <TranslatorsForm
                                onFormSubmit={translatorsFormSubmit}
                            />
                            <StyledButton
                                aria-describedby={id}
                                onClick={openAlertConfirmation}
                                fullWidth={screenIsSmall}
                                disabled={!isAdmin}
                                className="translators-container__menu-button"
                                startIcon={
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                }
                            >
                                Send emails
                            </StyledButton>
                        </>
                    )}
                    <StyledButton
                        aria-describedby={id}
                        onClick={handleClick}
                        className="translators-container__menu-button"
                        startIcon={<FontAwesomeIcon icon={faPiggyBank} />}
                    >
                        Show total
                    </StyledButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        className={'sum-popover'}
                    >
                        <Typography sx={{ p: 2 }} align={'left'}>
                            {`Dating total: `}
                            <b>{`${calculateMonthTotal(
                                DEFAULT_CATEGORIES.dating
                            )} $`}</b>
                        </Typography>
                        <Typography sx={{ p: 2 }} align={'left'}>
                            {`Gifts svadba: `}
                            <b>{`${calculateMonthTotal(
                                DEFAULT_CATEGORIES.virtualGiftsSvadba
                            )} $`}</b>
                        </Typography>
                        <Typography sx={{ p: 2 }} align={'left'}>
                            {`Gifts dating: `}
                            <b>{`${calculateMonthTotal(
                                DEFAULT_CATEGORIES.virtualGiftsDating
                            )} $`}</b>
                        </Typography>
                        <Typography sx={{ p: 2 }} align={'left'}>
                            {`Phone calls: `}
                            <b>{`${calculateMonthTotal(
                                DEFAULT_CATEGORIES.phoneCalls
                            )} $`}</b>
                        </Typography>
                        <Typography sx={{ p: 2 }} align={'left'}>
                            {`Chats total: `}
                            <b>{`${calculateMonthTotal(
                                DEFAULT_CATEGORIES.chats
                            )} $`}</b>
                        </Typography>
                        <Typography sx={{ p: 2 }} align={'left'}>
                            {`Letters total: `}
                            <b>{`${calculateMonthTotal(
                                DEFAULT_CATEGORIES.letters
                            )} $`}</b>
                        </Typography>
                        <Typography sx={{ p: 2 }} align={'left'}>
                            {`Penalties: `}
                            <b>{`${calculateMonthTotal(
                                DEFAULT_CATEGORIES.penalties
                            )} $`}</b>
                        </Typography>
                        <Divider />
                        <Typography sx={{ p: 2 }} align={'left'}>
                            {`Total by ${moment().format('D MMMM')}: `}{' '}
                            <b>{`${calculateMonthTotal()} $`}</b>
                        </Typography>
                    </Popover>
                    <div className="gallery-menu__inline-filters">
                        <div className="gallery-menu__filters-label">Menu</div>
                        <div className={'gallery-menu__checkbox-container'}>
                            <Checkbox
                                defaultChecked
                                name={'suspended'}
                                disabled={!isAdmin}
                                onChange={changeFilter}
                            />
                            Hide suspended
                        </div>
                        <div className="gallery-menu__date-container">
                            <MobileDatePicker
                                label="Balance date"
                                value={translatorFilter.date}
                                name={'date'}
                                onChange={changeFilter}
                                disabled={!isAdmin}
                                renderInput={params => (
                                    <TextField {...params} />
                                )}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div
                id="on-scroll__rotate-animation-list"
                className={
                    'inner-gallery-container translators-container animated-box scrolled-container'
                }
            >
                {translators.length && !loading ? (
                    memoizedFilteredTranslators.map(item => (
                        <SingleTranslator
                            {...item}
                            key={item._id}
                            dollarToUahRate={dollarToUahRate}
                            dragOverHandler={dragOverHandler}
                            onBoardDrop={onBoardDrop}
                            dragLeaveHandler={dragLeaveHandler}
                            balanceDaySubmit={balanceDaySubmit}
                            alertStatusConfirmation={alertStatusConfirmation}
                            openAlertConfirmation={openAlertConfirmation}
                            closeAlertConfirmationNoReload={
                                closeAlertConfirmationNoReload
                            }
                            suspendTranslator={suspendTranslator}
                            suspendClient={suspendClient}
                            selectedDate={translatorFilter.date}
                            addPersonalPenaltyToTranslator={
                                addPersonalPenaltyToTranslator
                            }
                            updateTranslatorEmail={updateTranslatorEmail}
                            admin={isAdmin}
                            bonus={chatsBonus.find(
                                bonus => bonus._id === item._id
                            )}
                        />
                    ))
                ) : loading ? (
                    <div className="empty">
                        {' '}
                        <Loader />{' '}
                    </div>
                ) : (
                    <div className="empty">
                        <h1>No translators yet.</h1>
                    </div>
                )}
            </div>
            <AlertMessage
                mainText={message.text}
                open={alertOpen}
                handleOpen={openAlert}
                handleClose={closeAlert}
                status={message.status}
            />
            <AlertMessageConfirmation
                mainText={'Please confirm mailout'}
                additionalText={
                    "Continue, if you've finished all work in translator's statistics"
                }
                open={alertStatusConfirmation}
                handleClose={closeAlertConfirmationNoReload}
                handleOpen={openAlertConfirmation}
                status={false}
                onCancel={closeAlertConfirmationNoReload}
                onConfirm={sendNotificationEmails}
                loadingStatus={mailoutInProgress}
            />
        </div>
    ) : (
        <LoggedOutPage />
    )
}

export default Translators
