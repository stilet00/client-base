import Badge from '@mui/material/Badge'
import { Avatar } from '@material-ui/core'
import { styled } from '@mui/material/styles'

export default function StatementItemInnerElement({
    receiver,
    amount,
    date,
    sender,
    comment,
    avatar,
    image,
}) {
    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 20,
        height: 20,
        border: `2px solid ${theme.palette.background.paper}`,
    }))
    return (
        <div className={'finances-inner-wrapper__list-item'}>
            <div className="list-item__picture">
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <SmallAvatar
                            alt={sender}
                            src={avatar}
                            style={{ backgroundColor: 'rgba(145, 31, 31, 1)' }}
                        />
                    }
                >
                    {image}
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
        </div>
    )
}
