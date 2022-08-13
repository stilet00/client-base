import { useCallback, useEffect, useState } from 'react'
import { useAlert } from '../../sharedComponents/AlertMessage/hooks'
import {
    addTask,
    changeTodoStatus,
    getTasks,
    removeTask,
} from '../../services/taskListServices/services'
import moment from 'moment'

export const useTaskList = user => {
    const [tasks, setTasks] = useState([])

    const [loading, setLoading] = useState(true)

    const { alertOpen, closeAlert, openAlert } = useAlert()

    useEffect(() => {
        if (user) {
            getTasks().then(res => {
                setLoading(false)
                setTasks(res.data)
            })
        }
    }, [user])

    const newTask = useCallback(
        text => {
            if (text) {
                let task = {
                    taskName: text,
                    completed: false,
                    created: moment().format('MMMM Do YYYY, h:mm:ss'),
                }

                addTask(task).then(res => {
                    if (res.status === 200) {
                        setTasks(prevTasks => {
                            let newTask = { ...task, _id: res.data }
                            return [...prevTasks, newTask]
                        })
                    } else {
                        console.log('something went wrong')
                    }
                })
            } else {
                openAlert()
            }
        },
        [openAlert]
    )

    const deleteTask = useCallback(_id => {
        removeTask(_id).then(res => {
            if (res.status === 200) {
                setTasks(prevTasks =>
                    prevTasks.filter(item => item._id !== _id)
                )
            } else {
                console.log('something went wrong')
            }
        })
    }, [])

    const toggleTodo = useCallback(task => {
        changeTodoStatus(task).then(res => {
            if (res.status === 200) {
                setTasks(prevTasks =>
                    prevTasks.map(item => (item._id === task._id ? task : item))
                )
            }
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
    }
}
