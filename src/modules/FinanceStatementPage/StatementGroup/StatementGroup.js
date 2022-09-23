import SingleStatement from './SingleStatement'

export default function StatementGroup({
    date,
    dateGroup,
    deletingOneStatement,
}) {
    return (
        <>
            <div className={'finances-inner-wrapper__header'}>{date}</div>
            {dateGroup.map((data, index) => (
                <SingleStatement
                    key={data._id}
                    {...data}
                    onDelete={deletingOneStatement}
                />
            ))}
        </>
    )
}
