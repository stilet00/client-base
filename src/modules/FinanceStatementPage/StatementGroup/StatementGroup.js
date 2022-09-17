import SingleStatement from './SingleStatement'

export default function StatementGroup({ date, dateGroup }) {
    return (
        <>
            <div className={'finances-inner-wrapper__header'}>{date}</div>
            {dateGroup.map((data, index) => (
                <SingleStatement key={date.id + index} {...data} />
            ))}
        </>
    )
}
