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
    let CustomDiv = styled.div`
        width: 100%;
        height: 40%;
        border-radius: 10px 10px 0 0;
        background: url(${TASKS_BACKGROUNDS[getRandomFrom1To10()]});
        background-size: 100%;
        background-position: center;
        transition: background-size 2s;
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
            <CustomDiv
                style={completed ? { opacity: '0.2' } : { opacity: '1' }}
            ></CustomDiv>
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
            <CardActions
                style={
                    completed
                        ? {
                              ...styles.taskFooter,
                              background: transparentColor,
                              opacity: '0.1',
                          }
                        : styles.taskFooter
                }
            >
                <ColoredButton
                    variant={'outlined'}
                    onClick={() => onDelete(_id)}
                    style={{
                        background: completed
                            ? footerAndButtonsColor
                            : transparentColor,
                    }}
                >
                    <DeleteForeverIcon />
                </ColoredButton>
                <ColoredButton
                    variant={'outlined'}
                    onClick={toggler}
                    disabled={completed}
                    style={{
                        background: completed
                            ? footerAndButtonsColor
                            : transparentColor,
                    }}
                >
                    {toggleButton}
                </ColoredButton>
            </CardActions>
        </li>
    )
}

export default SingleTask
const footerAndButtonsColor = 'rgb(236, 251, 255)'
const transparentColor = 'rgba(255,255,255,1)'
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
        background: footerAndButtonsColor,
        borderRadius: '0 0 10px 10px',
    },
}