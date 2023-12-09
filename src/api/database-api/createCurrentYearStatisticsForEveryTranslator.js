const moment = require('moment')
const {
    createYearStatisticsForTranslator,
    insertClientToTranslatorBalanceDays,
} = require('../translatorsBalanceFunctions/translatorsBalanceFunctions')

let ObjectId = require('mongodb').ObjectID

const getUpdatedStatisticsForSingleTranslator = async translator => {
    const statisticsOnTranslator = translator.statistics

    const statisticsHasCurrentYearData = statisticsOnTranslator?.some(
        yearStatisticsData =>
            yearStatisticsData.year === moment().format('YYYY')
    )

    if (!statisticsHasCurrentYearData) {
        const emptyYearStatisticsForTranslator =
            createYearStatisticsForTranslator()

        let translatorStatisticsFilledWithClient = {
            ...emptyYearStatisticsForTranslator,
        }

        const clientsOnTranslator = translator.clients

        clientsOnTranslator.forEach(client => {
            insertClientToTranslatorBalanceDays(
                translatorStatisticsFilledWithClient,
                client._id
            )
        })

        return [...translator.statistics, translatorStatisticsFilledWithClient]
    }
}

const createCurrentYearStatisticsForEveryTranslator =
    async translatorDataBase => {
        const translatorCollection = await translatorDataBase.find().exec()

        for (const translator of translatorCollection) {
            const updatedStatisticsOnTranslator =
                await getUpdatedStatisticsForSingleTranslator(translator)

            if (updatedStatisticsOnTranslator) {
                translatorDataBase.updateOne(
                    { _id: ObjectId(translator._id) },
                    {
                        $set: {
                            statistics: updatedStatisticsOnTranslator,
                        },
                    },
                    error => {
                        console.error(error)
                    }
                )
                console.log(`${translator.name} was updated in DB`)
            }
        }
    }

module.exports = {
    createCurrentYearStatisticsForEveryTranslator,
}
