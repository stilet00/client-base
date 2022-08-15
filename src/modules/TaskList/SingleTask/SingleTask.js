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
import styled from 'styled-components'

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
    const getRandomFrom1To10 = () => Math.floor(Math.random() * 10)
    const TaskBackgroundImageContainer = styled.div`
        width: 100%;
        height: 40%;
        border-radius: 10px 10px 0 0;
        background: url(${TASKS_BACKGROUNDS[getRandomFrom1To10()]});
        background-size: 100%;
        background-position: center;
        border-radius: 10px 10px 0 0;
        transition: background-size 2s;
        cursor: zoom-in;
        &:hover {
            background-size: 150%;
        }
    `
    return (
        <li
            id={_id}
            className={
                completed
                    ? 'task gallery-item completed'
                    : 'task gallery-item gradient-box'
            }
        >
            <TaskBackgroundImageContainer
                style={{ opacity: completed ? '0.2' : '1' }}
            ></TaskBackgroundImageContainer>
            <CardContent
                style={
                    completed
                        ? {
                              ...styles.taskContent,
                              color: 'rgb(192,192,192)',
                          }
                        : styles.taskContent
                }
            >
                <Typography
                    variant="h5"
                    component="div"
                    style={{ fontSize: '1.2rem' }}
                >
                    {taskName}
                </Typography>
            </CardContent>
            <CardActions
                style={
                    completed
                        ? {
                              ...styles.taskFooter,
                              background: transparentColor,
                          }
                        : styles.taskFooter
                }
            >
                <ColoredButton
                    variant={'outlined'}
                    onClick={() => onDelete(_id)}
                    style={{
                        background: contentContainerColor,
                    }}
                >
                    <DeleteForeverIcon />
                </ColoredButton>
                <ColoredButton
                    variant={'outlined'}
                    onClick={toggler}
                    disabled={completed}
                    style={
                        completed
                            ? { display: 'none' }
                            : { background: contentContainerColor }
                    }
                >
                    {toggleButton}
                </ColoredButton>
                <div style={styles.taskFooterText}>
                    <Typography color="text.secondary">{done}</Typography>
                    <Typography variant="body2">Created: {created}</Typography>
                </div>
            </CardActions>
        </li>
    )
}

export default SingleTask
const footerColor = 'rgb(236, 251, 255)'
const contentContainerColor = 'rgba(255,250,240,1)'
const transparentColor = 'rgba(0, 0, 0, 0.07)'
const styles = {
    taskContent: {
        fontFamily: 'Open Sans, sans-serif',
        color: 'rgb(30,32,33)',
        fontSize: '1.2rem',
        padding: '1rem',
        overflowY: 'scroll',
        height: '30%',
    },
    taskFooter: {
        background: footerColor,
        borderRadius: '0 0 10px 10px',
    },
    taskFooterText: {
        textAlign: 'center',
        width: '80%',
    },
}


