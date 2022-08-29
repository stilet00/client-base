import styled from 'styled-components'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { green } from '@mui/material/colors'

const StyledItem = styled.div`
    border-bottom: 1px solid rgb(224, 224, 224);
    background: rgb(255, 255, 255, 1);
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    transition: all 0.5s;
    :hover {
        background: rgb(192 190 190);
    }
    div: first-child {
        width: 20%;
    }
    div: nth-child(2) {
        height: 100%;
        flex: 1;
        text-align: left;
        box-sizing: border-box;
        padding: 0.7rem 0;
        font-family: Open Sans, sans-serif;
        > p {
            font-size: 1rem;
            margin: 0;
            margin-bottom: 0.1rem;
            color: rgb(51, 51, 51, 1);
        }
        p: nth-child(2) {
            font-size: 0.8rem;
            color: rgb(147 160 171, 1);
        }
        p: last-child {
            font-size: 1.2rem;
            font-family: auto;
            > span {
                color: rgb(147 160 171, 1);
                font-size: 1rem;
            }
        }
    }
`
export default function SinglePayment({
    name,
    amount,
    date,
    sender,
    comments,
}) {
    return (
        <StyledItem>
            <div>
                <MonetizationOnIcon
                    sx={{ fontSize: 40, color: green['A400'] }}
                />
            </div>
            <div>
                <p>{comments}</p>
                <p>
                    Reciever: {name}
                    <br></br>
                    Sender: {sender}
                    <br></br>
                    {date}
                </p>
                <p>
                    <strong>-{amount}</strong> <span>$</span>
                </p>
            </div>
        </StyledItem>
    )
}
