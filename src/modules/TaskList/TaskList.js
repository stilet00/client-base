import React from 'react'
import { useSelector } from 'react-redux'
import '../../styles/modules/TaskList.css'
import SingleTask from './SingleTask/SingleTask'
import Form from './Form/Form'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Loader from '../../sharedComponents/Loader/Loader'
import LoggedOutPage from '../AuthorizationPage/LoggedOutPage/LoggedOutPage'
import AlertMessage from '../../sharedComponents/AlertMessage/AlertMessage'
import { useTaskList } from './businessLogic'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

function TaskList() {
    const user = useSelector(state => state.auth.user)
    const {
        tasks,
        alertOpen,
        closeAlert,
        openAlert,
        deleteTask,
        newTask,
        toggleTodo,
        loading,
    } = useTaskList(user)

    if (!user) {
        return <LoggedOutPage />
    }
    if (loading) {
        return <Loader />
    }
    return (
        <>
            <div
                className={'taskList-container scrolled-container animated-box'}
            >
                {tasks.length > 0 ? (
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
                ) : (
                    <h1>No tasks yet</h1>
                )}
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
    )
}

export default TaskList
