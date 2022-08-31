import '../../../styles/modules/FinanceStatementPage.css'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { green } from '@mui/material/colors'

export default function SinglePayment({ name, amount, date, sender, comment }) {
    return (
        <div className={'inner-wrapper__element'}>
            <div>
                <MonetizationOnIcon
                    sx={{ fontSize: 40, color: green['A400'] }}
                />
            </div>
            <div>
                <p>{comment}</p>
                <p>
                    Receiver: {name}
                    <br></br>
                    Sender: {sender}
                    <br></br>
                    {date}
                </p>
                <p>
                    <strong>-{amount}</strong> <span>$</span>
                </p>
            </div>
        </div>
    )
}
