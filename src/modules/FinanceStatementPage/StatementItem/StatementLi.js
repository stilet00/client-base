import '../../../styles/modules/FinanceStatementPage.css'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import { green, blue } from '@mui/material/colors'
import Badge from '@mui/material/Badge'
import { Avatar } from '@material-ui/core'
import agency from '../../../images/logo.png'
import anton from '../../../images/avatars/anton-avatar.png'
import oleksandr from '../../../images/avatars/sasha-avatar.png'
import { styled } from '@mui/material/styles'

export default function StatementLi({
    receiver,
    amount,
    date,
    sender,
    comment,
}) {
    const currentSender = () =>
        sender === 'Anton' ? anton : sender === 'Oleksandr' ? oleksandr : agency
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
                            alt="Remy Sharp"
                            src={currentSender()}
                            style={{ backgroundColor: 'rgba(145, 31, 31, 1)' }}
                        />
                    }
                >
                    {comment === 'salary' ? (
                        <MonetizationOnIcon
                            sx={{ fontSize: 40, color: green['A400'] }}
                        />
                    ) : (
                        <CreditScoreIcon
                            sx={{ fontSize: 40, color: blue['A400'] }}
                        />
                    )}
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
