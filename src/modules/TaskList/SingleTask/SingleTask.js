import React from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import moment from 'moment'
import ColoredButton from '../../../sharedComponents/ColoredButton/ColoredButton'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import { TASKS_BACKGROUNDS } from '../../../constants/constants'
import styled from 'styled-components'

const taskTextDefaultColor = 'rgb(30,32,33)'
const taskTextCompletedColor = 'rgb(224,224,224)'
const footerColor = 'rgb(236, 251, 255)'
const contentContainerColor = 'rgba(255,250,240,1)'
const transparentColor = 'rgba(0, 0, 0, 0.07)'
const styles = {
    taskFooter: {
        background: footerColor,
        borderRadius: '0 0 10px 10px',
        display: 'flex',
    },
    taskFooterText: {
        textAlign: 'right',
        flex: '1',
    },
}

function SingleTask({
    taskName,
    _id,
    onDelete,
    created,
    completed,
    onToggle,
    doneAt,
    admin,
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
    const wallpaperIndex = React.useMemo(() => getRandomFrom1To10(), [])
    const TaskBackgroundImageContainer = styled.div`
        width: 100%;
        height: 155px;
        border-radius: 10px 10px 0 0;
        background: url(${TASKS_BACKGROUNDS[wallpaperIndex]});
        background-size: 100%;
        background-position: center;
        border-radius: 10px 10px 0 0;
        transition: background-size 2s;
        &:hover {
            background-size: 150%;
        }
    `
    const TaskDescription = styled.div`
        display: flex;
        position: relative;
        box-sizing: border-box;
        height: 30%;
        max-height: 100px;
        padding: 6px 12px;
        font-family: Open Sans, sans-serif;
        color: ${props =>
            props.completed ? taskTextCompletedColor : taskTextDefaultColor};
        font-size: 1rem;
        text-align: left;

        > p {
            cursor: zoom-in;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: [...];
            &::after {
                content: '${props => props.taskName}';
                position: absolute;
                box-sizing: border-box;
                padding: 12px;
                top: 0;
                left: 0;
                width: 100%;
                border-radius: 0 0 8px 8px;
                backdrop-filter: blur(5px);
                background: ${props =>
                    props.completed
                        ? 'rgba(0, 0, 0, 0.8)'
                        : 'rgba(255, 255, 255, 0.8)'};
                box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
                    0 10px 10px rgba(0, 0, 0, 0.22);
                font-weight: 600;
                color: inherit;
                opacity: 0;
                z-index: -1;
                transition: opacity 1s ease-in;
            }
            &:hover {
                &::after {
                    z-index: 1;
                    opacity: 1;
                }
            }
        }
    `
    const taskDescriptionProps = {
        taskName,
        completed,
    }

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
            <TaskDescription {...taskDescriptionProps}>
                <Typography
                    variant="h5"
                    component="p"
                    style={{ fontSize: '1.2rem' }}
                >
                    {taskName}
                </Typography>
            </TaskDescription>
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
                    disabled={!admin}
                    onClick={() => onDelete(_id)}
                    style={{
                        background: contentContainerColor,
                    }}
                >
                    <DeleteForeverIcon />
                </ColoredButton>

                {!completed && (
                    <ColoredButton
                        variant={'outlined'}
                        onClick={toggler}
                        disabled={completed}
                        style={{ background: contentContainerColor }}
                    >
                        {toggleButton}
                    </ColoredButton>
                )}
                <div style={styles.taskFooterText}>
                    <Typography color="text.secondary">{done}</Typography>
                    <Typography variant="body2">Created: {created}</Typography>
                </div>
            </CardActions>
        </li>
    )
}

export default SingleTask
