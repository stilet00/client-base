import React from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import moment from 'moment'
import ColoredButton from '../../../sharedComponents/ColoredButton/ColoredButton'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { TASKS_BACKGROUNDS } from '../../../constants/constants'

function SingleTask({
    taskName,
    _id,
    onDelete,
    created,
    completed,
    onToggle,
    doneAt,
}) {
    const toggler = () => {
        let item = {
            _id: _id,
            taskName: taskName,
            completed: !completed,
            created: created,
            doneAt: moment().format('MMMM Do YYYY, h:mm:ss'),
        }
        onToggle(item)
    }
    let done = doneAt ? (
        <p className={'task-date done-text'}>Done: {doneAt}</p>
    ) : null

    let toggleButton = !completed ? <DoneOutlineIcon /> : <DoneAllIcon />
    return (
        <li
            id={_id}
            className={
                completed
                    ? 'task gallery-item completed'
                    : 'task gallery-item gradient-box'
            }
        >
            <div
                className="task-card_background"
                style={
                    completed
                        ? {
                              ...styles.taskHeaderBackground,
                              backgroundImage: `url(${
                                  TASKS_BACKGROUNDS[
                                      Math.floor(Math.random() * 10)
                                  ]
                              })`,
                              opacity: '0.2',
                          }
                        : {
                              ...styles.taskHeaderBackground,
                              backgroundImage: `url(${
                                  TASKS_BACKGROUNDS[
                                      Math.floor(Math.random() * 10)
                                  ]
                              })`,
                          }
                }
            ></div>
            <CardContent style={{ padding: '0' }}>
                <Typography
                    variant="h5"
                    component="div"
                    style={
                        completed
                            ? {
                                  ...styles.taskContent,
                                  color: 'rgb(192,192,192)',
                              }
                            : styles.taskContent
                    }
                >
                    {taskName}
                </Typography>

                <Typography variant="body2" style={{ marginTop: '10px' }}>
                    Created: {created}
                </Typography>
                <Typography
                    style={{ marginTop: '10px' }}
                    color="text.secondary"
                >
                    {done}
                </Typography>
            </CardContent>
            <CardActions style={styles.taskFooter}>
                <ColoredButton
                    variant={'contained'}
                    onClick={() => onDelete(_id)}
                    style={
                        completed
                            ? { background: 'rgb(234, 0, 85)' }
                            : { backgroundColor: 'rgba(255,255,255,1)' }
                    }
                >
                    <DeleteForeverIcon />
                </ColoredButton>
                <ColoredButton
                    variant={'contained'}
                    onClick={toggler}
                    disabled={completed}
                    style={
                        completed
                            ? { background: 'rgb(234, 0, 85)' }
                            : { backgroundColor: 'rgba(255,255,255,1)' }
                    }
                >
                    {toggleButton}
                </ColoredButton>
            </CardActions>
        </li>
    )
}

export default SingleTask

const styles = {
    taskContent: {
        fontFamily: 'Open Sans, sans-serif',
        color: 'rgb(30,32,33)',
    },
    taskHeaderBackground: {
        width: '100%',
        height: '40%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '10px 10px 0 0',
    },
    taskFooter: {
        background: 'rgb(234, 0, 85)',
        borderRadius: '0 0 10px 10px',
    },
}