const firebaseAdmin = require('firebase-admin')
const googleFirebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(
        JSON.parse(process.env.GOOGLE_ACCOUNT_CREDENTIALS)
    ),
})

const getUserIdTokenFromRequest = request => {
    try {
        return request.header('authorization').split(' ')[1].toString()
    } catch (err) {
        throw new Error('Someting went wrong with authorization header')
    }
}

const checkIfUserIsAuthenticatedBeforeExecute = ({
    callBack,
    response,
    request,
}) => {
    try {
        const clientIdToken = getUserIdTokenFromRequest(request)
        googleFirebaseApp
            .auth()
            .verifyIdToken(clientIdToken)
            .then(decodedToken => {
                if (decodedToken) {
                    callBack()
                }
            })
            .catch(error => {
                console.log(error)
                response.sendStatus(401)
            })
    } catch (error) {
        console.log(
            "Error: Something went wrong with checking user's authentication"
        )
        response.sendStatus(401)
    }
}

module.exports = {
    checkIfUserIsAuthenticatedBeforeExecute,
}
