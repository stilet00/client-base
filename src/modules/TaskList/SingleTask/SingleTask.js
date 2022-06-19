import React from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import moment from 'moment'
import ColoredButton from '../../../sharedComponents/ColoredButton/ColoredButton'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

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
            <CardContent>
                <Typography variant="h5" component="div">
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
            <CardActions>
                <ColoredButton
                    variant={'outlined'}
                    onClick={() => onDelete(_id)}
                    style={
                        completed
                            ? { backgroundColor: 'rgba(255,255,255,1)' }
                            : null
                    }
                >
                    <DeleteForeverIcon />
                </ColoredButton>
                <ColoredButton
                    variant={'outlined'}
                    onClick={toggler}
                    disabled={completed}
                >
                    {toggleButton}
                </ColoredButton>
            </CardActions>
        </li>
    )
}

export default SingleTask
