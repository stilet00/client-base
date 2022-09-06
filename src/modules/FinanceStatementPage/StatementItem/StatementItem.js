import React from 'react'
import StatementLi from './StatementLi'

export default function StatementItem({ date, dateGroup }) {
    return (
        <>
            <div className={'finances-inner-wrapper__header'}>{date}</div>
            {dateGroup.map(data => (
                <StatementLi key={date.id} {...data} />
            ))}
        </>
    )
}
