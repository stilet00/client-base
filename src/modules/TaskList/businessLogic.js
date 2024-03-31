import { useCallback, useEffect, useState } from 'react'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import {
    addTask,
    changeTodoStatus,
    getTasks,
    removeTask,
    getTaskNotificationsSettings,
    changeTaskNotificationsSettings,
} from '../../services/taskListServices/services'
import moment from 'moment'

export const useTaskList = user => {
    const [tasks, setTasks] = useState([])

    const [loading, setLoading] = useState(true)

    const [notificationsAreAllowed, setNotificationsAreAllowed] = useState(true)
    const [alertInfo, setAlertInfo] = useState({
        mainTitle: 'no message had been put',
        status: true,
    })
    const { alertOpen, closeAlert, openAlert } = useAlert()

    useEffect(() => {
        ;(async () => {
            if (user) {
                const responseWithTasks = await getTasks()
                if (responseWithTasks.status === 200) {
                    setTasks(responseWithTasks.data)
                }
                const responseWithTaskNotificationsSettings =
                    await getTaskNotificationsSettings()
                if (responseWithTaskNotificationsSettings.status === 200) {
                    setNotificationsAreAllowed(
                        responseWithTaskNotificationsSettings.data[0]?.allowed
                    )
                }
                setLoading(false)
            }
        })()
    }, [user])

    const onTaskNotificationsSettingsChange = () => {
        const changedTaskNotificationsSettings = !notificationsAreAllowed
        changeTaskNotificationsSettings(changedTaskNotificationsSettings)
            .then(res => {
                if (res.status === 200) {
                    setNotificationsAreAllowed(changedTaskNotificationsSettings)
                }
            })
            .catch(err => {
                const message =
                    err?.response?.data?.error || 'An error occurred'
                setAlertInfo({
                    ...alertInfo,
                    mainTitle: message,
                    status: false,
                })
                openAlert()
            })
    }

    const newTask = useCallback(
        text => {
            if (text) {
                let task = {
                    taskName: text,
                    completed: false,
                    created: moment().format('MMMM Do YYYY, h:mm:ss'),
                }

                addTask(task)
                    .then(res => {
                        if (res.status === 200) {
                            setTasks(prevTasks => {
                                let newTask = { ...task, _id: res.data }
                                return [...prevTasks, newTask]
                            })
                        }
                    })
                    .catch(err => {
                        const message =
                            err?.response?.data?.error || 'An error occurred'
                        setAlertInfo({
                            ...alertInfo,
                            mainTitle: message,
                            status: false,
                        })
                        openAlert()
                    })
            } else {
                openAlert()
            }
        },
        [openAlert]
    )

    const deleteTask = useCallback(_id => {
        removeTask(_id)
            .then(res => {
                if (res.status === 200) {
                    setTasks(prevTasks =>
                        prevTasks.filter(item => item._id !== _id)
                    )
                }
            })
            .catch(err => {
                const message =
                    err?.response?.data?.error || 'An error occurred'
                setAlertInfo({
                    ...alertInfo,
                    mainTitle: message,
                    status: false,
                })
                openAlert()
            })
    }, [])

    const toggleTodo = useCallback(task => {
        changeTodoStatus(task)
            .then(res => {
                if (res.status === 200) {
                    setTasks(prevTasks =>
                        prevTasks.map(item =>
                            item._id === task._id ? task : item
                        )
                    )
                }
            })
            .catch(err => {
                const message =
                    err?.response?.data?.error || 'An error occurred'
                setAlertInfo({
                    ...alertInfo,
                    mainTitle: message,
                    status: false,
                })
                openAlert()
            })
    }, [])

    return {
        tasks,
        deleteTask,
        toggleTodo,
        newTask,
        alertOpen,
        openAlert,
        closeAlert,
        loading,
        notificationsAreAllowed,
        onTaskNotificationsSettingsChange,
    }
}
