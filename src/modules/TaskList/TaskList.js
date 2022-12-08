import React from 'react'
import '../../styles/modules/TaskList.css'
import SingleTask from './SingleTask/SingleTask'
import Form from './Form/Form'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Loader from '../../sharedComponents/Loader/Loader'
import Unauthorized from '../AuthorizationPage/Unauthorized/Unauthorized'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import { useTaskList } from './businessLogic'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

function TaskList({ user }) {
    const {
        tasks,
        alertOpen,
        closeAlert,
        openAlert,
        deleteTask,
        newTask,
        toggleTodo,
        loading,
        notificationsAreAllowed,
        onTaskNotificationsSettingsChange,
    } = useTaskList(user)

    const page =
        tasks.length && !loading ? (
            <TransitionGroup className="todo-list" component={'ul'}>
                {tasks.map(item => (
                    <CSSTransition
                        key={item._id}
                        timeout={500}
                        classNames="item"
                    >
                        <SingleTask
                            {...item}
                            onDelete={deleteTask}
                            onToggle={toggleTodo}
                        />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        ) : loading ? (
            <Loader />
        ) : (
            <h1>No tasks yet</h1>
        )
    return user ? (
        <>
            <div className={'taskList-menu'}>
                <div className={'taskList-menu__switch-container'}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificationsAreAllowed}
                                    onChange={onTaskNotificationsSettingsChange}
                                />
                            }
                            label={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Email notifications
                                </Typography>
                            }
                        />
                    </FormGroup>
                </div>
            </div>
            <div
                className={'taskList-container scrolled-container animated-box'}
            >
                {page}
            </div>
            <div className="socials button-add-container">
                <Form addTask={newTask} />
            </div>
            <AlertMessage
                mainText={'Empty task'}
                open={alertOpen}
                handleOpen={openAlert}
                handleClose={closeAlert}
                status={false}
            />
        </>
    ) : (
        <Unauthorized />
    )
}

export default TaskList
