import moment from 'moment'

const useNightTime = () => {
    const isEveningTime = moment().isSameOrAfter(
        moment('9:00:00 pm', 'h:mm:ss a')
    )
    const isNightTime = moment().isBetween(
        moment('12:00:00 am', 'h:mm:ss a'),
        moment('7:00:00 am', 'h:mm:ss a')
    )

    return isEveningTime || isNightTime
}

export default useNightTime
