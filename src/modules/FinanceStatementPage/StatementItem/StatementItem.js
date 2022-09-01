import '../../../styles/modules/FinanceStatementPage.css'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { green } from '@mui/material/colors'

export default function StatementItem({ name, amount, date, sender, comment }) {
    return (
        <div className={'finances-inner-wrapper__list-item'}>
            <div className="list-item__picture">
                <MonetizationOnIcon
                    sx={{ fontSize: 40, color: green['A400'] }}
                />
            </div>
            <div className="list-item__info">
                <p>{comment}</p>
                <div className="list-item__info_aditional-info">
                    <span>Receiver: {name}</span>
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
