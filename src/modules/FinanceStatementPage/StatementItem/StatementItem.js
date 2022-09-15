import React from 'react'
import StatementItemInnerElement from './StatementItemInnerElement'

export default function StatementItem({ date, dateGroup }) {
    return (
        <>
            <div className={'finances-inner-wrapper__header'}>{date}</div>
            {dateGroup.map((data, index) => (
                <StatementItemInnerElement key={date.id + index} {...data} />
            ))}
        </>
    )
}
