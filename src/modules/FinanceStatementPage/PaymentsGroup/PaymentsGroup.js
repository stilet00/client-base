import moment from 'moment'
import SinglePayment from './SinglePayment'

export default function PaymentsGroup({ date, dateGroup, deleteOneStatement }) {
    return (
        <>
            <div className={'finances-inner-wrapper__header'}>
                {moment(date).format(`YYYY MM DD`)}
            </div>
            {dateGroup.map(data => (
                <SinglePayment
                    key={data._id}
                    {...data}
                    onDelete={deleteOneStatement}
                />
            ))}
        </>
    )
}
