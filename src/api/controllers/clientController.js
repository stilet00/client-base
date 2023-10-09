const { getCollections } = require('../database/collections')
let ObjectId = require('mongodb').ObjectID
const sharp = require('sharp')

const clientImageConverter = async image => {
    try {
        const format = 'jpeg'
        const resizedImageBuffer = await sharp(
            Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        )
            .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
            .toFormat('jpeg')
            .toBuffer()

        const resizedImageBase64 = `data:image/${format};base64,${resizedImageBuffer.toString(
            'base64'
        )}`
        return resizedImageBase64
    } catch (err) {
        return image
    }
}
const getAllClients = (request, response) => {
    const noImageRequest = !!request.query?.params
    if (noImageRequest) {
        getCollections()
            .collectionClients.aggregate([
                { $project: { image: 0 } },
                { $sort: { name: 1 } },
            ])
            .toArray((err, docs) => {
                if (err) {
                    console.log(err)
                    return response.sendStatus(500)
                }
                response.send(docs)
            })
    } else {
        getCollections()
            .collectionClients.find()
            .sort({ name: 1 })
            .toArray((err, docs) => {
                if (err) {
                    console.log(err)
                    return response.sendStatus(500)
                }
                response.send(docs)
            })
    }
}

const addNewClient = async function (request, response, next) {
    try {
        if (!request.body) {
            return response.status(400).send('Ошибка при загрузке клиентки')
        }

        const { image } = request.body
        const resizedImage = await clientImageConverter(image)

        const newClientDataWithResizedImage = {
            ...request.body,
            image: resizedImage,
        }

        const result = await getCollections().collectionClients.insertOne(
            newClientDataWithResizedImage
        )

        response.status(201).send(result?.insertedId)
    } catch (error) {
        console.error(error)
        response.status(500).send('Internal Server Error')
    }
}

const editArrayOfClientsInTranslators = async info => {
    const { _id, name, surname } = info
    const translatorsWithEditedClient = await getCollections()
        .collectionTranslators.find({
            clients: {
                $elemMatch: {
                    _id: _id,
                },
            },
        })
        .toArray()
    if (translatorsWithEditedClient.length > 0) {
        for (let translator of translatorsWithEditedClient) {
            const arrayWithChangedClientsNames = translator.clients.map(
                client => {
                    if (client._id === _id) {
                        const clientWithChangedData = {
                            ...client,
                            name: name,
                            surname: surname,
                        }
                        return clientWithChangedData
                    } else {
                        return client
                    }
                }
            )
            changeClientNameInTranslatorsDataBase(
                translator._id,
                arrayWithChangedClientsNames
            )
        }
    }
}

const changeClientNameInTranslatorsDataBase = async (
    id,
    arrayWithChangedClientsNames
) => {
    await getCollections().collectionTranslators.updateOne(
        { _id: ObjectId(id) },
        {
            $set: {
                clients: arrayWithChangedClientsNames,
            },
        }
    )
}

const updateClient = async (request, response) => {
    try {
        if (!request.body) {
            return response.sendStatus(400)
        }
        const {
            image,
            name,
            surname,
            bankAccount,
            instagramLink,
            suspended,
            svadba,
            dating,
        } = request.body

        const resizedImage = await clientImageConverter(image)

        const result = await getCollections().collectionClients.updateOne(
            { _id: ObjectId(request.params.id) },
            {
                $set: {
                    name,
                    surname,
                    bankAccount,
                    instagramLink,
                    suspended,
                    image: resizedImage,
                    svadba: {
                        login: svadba.login,
                        password: svadba.password,
                    },
                    dating: {
                        login: dating.login,
                        password: dating.password,
                    },
                },
            }
        )

        if (result.matchedCount === 0) {
            return response.sendStatus(404)
        }

        const message = 'клиентка сохранена'
        response.send(message)

        editArrayOfClientsInTranslators(request.body)
    } catch (error) {
        console.error(error)
        response.sendStatus(500)
    }
}

// const deleteClient = (request, response) => {
//         collectionClients.deleteOne(
//             { _id: ObjectId(request.params.id) },
//             (err, docs) => {
//                 if (err) {
//                     return response.sendStatus(500)
//                 }
//                 response.sendStatus(200)
//             }
//         )
//     }

module.exports = { getAllClients, addNewClient, updateClient }
