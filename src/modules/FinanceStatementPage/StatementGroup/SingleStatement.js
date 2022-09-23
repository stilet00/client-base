import Badge from '@mui/material/Badge'
import { Avatar } from '@material-ui/core'
import { styled } from '@mui/material/styles'
import { FINANCES_IMAGES, FINANCES_AVATARS } from '../../../constants/constants'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

export default function StatementItemInnerElement({
    receiver,
    amount,
    date,
    sender,
    comment,
    _id,
    onDelete,
}) {
    const avatar = Object.keys(FINANCES_AVATARS).find(
        avatar => avatar === sender
    )
    const FinancesImage = Object.keys(FINANCES_IMAGES).find(
        image => image === comment
    )
    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 20,
        height: 20,
        border: `2px solid ${theme.palette.background.paper}`,
    }))

    function handleDelete(_id) {
        onDelete(_id)
    }

    return (
        <div className={'finances-inner-wrapper__list-item'}>
            <div className="list-item__picture">
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <SmallAvatar
                            alt={sender}
                            src={FINANCES_AVATARS[avatar]}
                            style={{ backgroundColor: 'rgba(145, 31, 31, 1)' }}
                        />
                    }
                >
                    {FINANCES_IMAGES[FinancesImage]}
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
                    <strong>-{amount}</strong> <span>$</span>
                </p>
            </div>
            <IconButton
                aria-label="delete"
                color="primary"
                onClick={() => handleDelete(_id)}
            >
                <DeleteIcon />
            </IconButton>
        </div>
    )
}
