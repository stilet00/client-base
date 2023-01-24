import Badge from '@mui/material/Badge'
import { Avatar } from '@material-ui/core'
import { styled } from '@mui/material/styles'
import { FINANCE_IMAGES, FINANCE_AVATARS } from '../../../constants/constants'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import MenuSharpIcon from '@mui/icons-material/MenuSharp'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import ClickAwayListener from '@mui/material/ClickAwayListener'

export default function SinglePayment({
    receiver,
    amount,
    date,
    sender,
    comment,
    _id,
    onDelete,
}) {
    const [displayMenu, setDisplayMenu] = useState(false)

    const avatar = Object.keys(FINANCE_AVATARS).find(
        avatar =>
            avatar.toLowerCase() === removeSpacesAndUppercaseFromString(sender)
    )
    const financesImage = Object.keys(FINANCE_IMAGES).find(
        image =>
            image.toLowerCase() === removeSpacesAndUppercaseFromString(comment)
    )
    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 20,
        height: 20,
        border: `2px solid ${theme.palette.background.paper}`,
    }))

    function removeSpacesAndUppercaseFromString(string) {
        const changedString = string.toLowerCase().split(' ').join('')
        return changedString
    }

    return (
        <div className={'finances-inner-wrapper__list-item'}>
            <div className="list-item__picture">
                <Badge
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    badgeContent={
                        <SmallAvatar
                            alt={sender}
                            src={FINANCE_AVATARS[avatar]}
                            style={{
                                backgroundColor: 'rgba(145, 31, 31, 1)',
                            }}
                        />
                    }
                >
                    {FINANCE_IMAGES[financesImage]}
                </Badge>
            </div>
            <div className="list-item__info">
                <p>{comment}</p>
                <div className="list-item__info_aditional-info">
                    <span>Receiver: {receiver}</span>
                    <span>Sender: {sender}</span>
                    <span>{date}</span>
                </div>
                <p className="list-item__info_amount-info">
                    {amount} <span>$</span>
                </p>
            </div>
            <ClickAwayListener onClickAway={() => setDisplayMenu(false)}>
                <IconButton
                    className="list-item__menu-button"
                    onClick={() => setDisplayMenu(!displayMenu)}
                >
                    <MenuSharpIcon />
                    {displayMenu ? (
                        <Button
                            className="menu-button_delete"
                            variant="contained"
                            aria-label="delete"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => onDelete(_id)}
                        >
                            delete
                        </Button>
                    ) : null}
                </IconButton>
            </ClickAwayListener>
        </div>
    )
}
