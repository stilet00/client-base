import * as React from 'react'
import './App.css'
import './styles/modules/karusell.css'
import './styles/modules/Gallery.css'
import './styles/modules/ClientsForm.css'
import { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'
import AuthorizationPage from './modules/AuthorizationPage/AuthorizationPage'
import TaskList from './modules/TaskList/TaskList'
import ListOfClients from './modules/ListOfClients/ListOfClients'
import ChartsContainer from './modules/Charts/ChartsContainer'
import firebase from 'firebase/app'
import 'firebase/auth'
import {
    FirebaseAuthProvider,
    FirebaseAuthConsumer,
} from '@react-firebase/auth'
import Translators from './modules/Translators/Translators'
import Overview from './modules/Overview/Overview'
import sun from '../src/images/sun_transparent.png'
import background from '../src/images/main-background-2.png'
import Footer from './modules/Footer/Footer'
import PreloadPage from './modules/PreloadPage/PreloadPage'
import FinanceStatementPage from './modules/FinanceStatementPage/FinanceStatementPage'
import BackgroundImageOnLoad from 'background-image-on-load'
import PrivateRoute from './modules/PrivateRoute/PrivateRoute'
import Navigation from './sharedComponents/Navigation/Navigation'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { saveUserIdTokenToLocalStorage } from './sharedFunctions/sharedFunctions'
import { useActivity } from './services/userActivity'

function App() {
    const [isLoaded, setIsLoaded] = useState(true)
    const { loggedIn } = useActivity()
    const stopLoading = () => {
        setIsLoaded(false)
    }

    useEffect(() => {
        const timeToRefresh = 1000 * 60 * 40
        if (loggedIn) {
            setTimeout(() => {
                firebase
                    .auth()
                    .currentUser.getIdToken(true)
                    .then(idToken => {
                        saveUserIdTokenToLocalStorage(idToken)
                    })
                    .catch(error => console.log(error))
            }, timeToRefresh)
        } else return
    }, [loggedIn])

    const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG)
    return (
        <Router>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
                    <PreloadPage isLoaded={isLoaded} />
                    <div
                        className={isLoaded ? 'App invisible' : 'App'}
                        style={{
                            background: isLoaded
                                ? 'white'
                                : `url(${background})`,
                        }}
                    >
                        <div className="sun">
                            <img
                                src={sun}
                                alt="Sun"
                                width={'150px'}
                                height={'150px'}
                            />
                        </div>
                        <FirebaseAuthConsumer>
                            {({ user }) => {
                                return <Navigation user={user} />
                            }}
                        </FirebaseAuthConsumer>
                        <main>
                            <FirebaseAuthConsumer>
                                {({ user }) => {
                                    return (
                                        <Switch>
                                            <PrivateRoute
                                                user={user}
                                                component={TaskList}
                                                path="/tasks"
                                                exact
                                            />
                                            <PrivateRoute
                                                user={user}
                                                component={FinanceStatementPage}
                                                path="/finances"
                                            />
                                            <Redirect
                                                from="/overview/*"
                                                to="/overview"
                                            />
                                            <Route
                                                path="/overview"
                                                component={() => (
                                                    <Overview user={user} />
                                                )}
                                            />
                                            <Route
                                                path="/translators"
                                                component={() => (
                                                    <Translators user={user} />
                                                )}
                                            />
                                            <Route
                                                path="/clients"
                                                component={() => (
                                                    <ListOfClients
                                                        user={user}
                                                    />
                                                )}
                                            />
                                            <Redirect
                                                from="/chart/*"
                                                to="/chart"
                                            />
                                            <Route
                                                path="/chart"
                                                component={() => (
                                                    <ChartsContainer
                                                        user={user}
                                                    />
                                                )}
                                            />
                                            <Route
                                                path="/"
                                                exact
                                                component={AuthorizationPage}
                                            />
                                            <Redirect from="/*" to="/" />
                                        </Switch>
                                    )
                                }}
                            </FirebaseAuthConsumer>
                        </main>
                        <Footer />
                    </div>
                    <BackgroundImageOnLoad
                        src={background}
                        onLoadBg={() => {
                            setTimeout(stopLoading, 1000)
                        }}
                        onError={err => console.log('error', err)}
                    />
                </FirebaseAuthProvider>
            </LocalizationProvider>
        </Router>
    )
}

export default App
