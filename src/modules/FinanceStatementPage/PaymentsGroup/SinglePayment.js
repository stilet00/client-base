import Badge from '@mui/material/Badge'
import { Avatar } from '@material-ui/core'
import { styled } from '@mui/material/styles'
import { FINANCE_IMAGES, FINANCE_AVATARS } from '../../../constants/constants'
import IconButton from '@mui/material/IconButton'
import { grey } from '@mui/material/colors'
import { useState } from 'react'
import MenuSharpIcon from '@mui/icons-material/MenuSharp'
import Button from '@mui/material/Button'

export default function SinglePayment({
    receiver,
    amount,
    date,
    sender,
    comment,
    _id,
    onDelete,
}) {
    const [isHover, setIsHover] = useState(false)
    const [displayMenu, setDisplayMenu] = useState(false)

    const handleMouseEnter = () => {
        setIsHover(true)
    }

    const handleMouseLeave = () => {
        setIsHover(false)
    }

    const avatar = Object.keys(FINANCE_AVATARS).find(
        avatar => compareStrings(avatar) === compareStrings(sender)
    )
    const FinancesImage = Object.keys(FINANCE_IMAGES).find(image =>
        isHover
            ? compareStrings(image) === compareStrings(comment + 'hover')
            : compareStrings(image) === compareStrings(comment)
    )
    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 20,
        height: 20,
        border: `2px solid ${theme.palette.background.paper}`,
    }))

    function compareStrings(string) {
        const newString = string.toLowerCase().split(' ').join('')
        return newString
    }

    return (
        <div
            className={'finances-inner-wrapper__list-item'}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="list-item__picture">
                <Badge
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    style={{ borderColor: isHover ? 'black' : 'white' }}
                    badgeContent={
                        <SmallAvatar
                            alt={sender}
                            src={FINANCE_AVATARS[avatar]}
                            style={{
                                backgroundColor: 'rgba(145, 31, 31, 1)',
                                borderColor: isHover ? 'black' : 'white',
                            }}
                        />
                    }
                >
                    {FINANCE_IMAGES[FinancesImage]}
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
            <IconButton
                className="list-item__menu-button"
                sx={{ color: isHover ? grey[50] : grey[400] }}
            >
                <MenuSharpIcon onClick={() => setDisplayMenu(!displayMenu)} />
                {displayMenu ? (
                    <Button
                        className="menu-button_delete"
                        variant="text"
                        aria-label="delete"
                        size="small"
                        sx={{ color: isHover ? grey[50] : grey[400] }}
                        onClick={() => onDelete(_id)}
                    >
                        delete
                    </Button>
                ) : null}
            </IconButton>
        </div>
    )
}
