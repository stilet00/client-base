const { getCollections } = require('../database/collections')
const ObjectId = require('mongodb').ObjectID

const getBalanceDay = async (req, res) => {
    try {
        const { dateTimeId, translatorId, clientId } = req.query
        const BalanceDay = await getCollections().collectionBalanceDays
        const balanceDay = await BalanceDay.findOne({
            translator: new ObjectId(translatorId),
            client: new ObjectId(clientId),
            dateTimeId: dateTimeId,
        })
        console.log(balanceDay)
        res.send(balanceDay)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

module.exports = {
    getBalanceDay,
}
