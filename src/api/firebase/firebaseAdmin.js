const firebaseAdmin = require('firebase-admin')
const googleFirebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(
        JSON.parse(process.env.GOOGLE_ACCOUNT_CREDENTIALS)
    ),
})

const getUserIdTokenFromRequest = request => {
    return request.header('authorization').split(' ')[1].toString()
}

const checkIfUserIsAuthenticatedBeforeExecute = ({
    callBack,
    response,
    request,
}) => {
    const clientIdToken = getUserIdTokenFromRequest(request)
    try {
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
        console.log("Something went wrong with checking user's authentication")
        response.sendStatus(401)
    }
}

module.exports = {
    checkIfUserIsAuthenticatedBeforeExecute,
}
