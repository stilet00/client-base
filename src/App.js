import * as React from 'react'
import './App.css'
import './styles/modules/karusell.css'
import './styles/modules/Gallery.css'
import './styles/modules/ClientsForm.css'
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './store/store'
import { BrowserRouter as Router } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'
import sun from '../src/images/sun_transparent.png'
import background from '../src/images/main-background-2.png'
import Footer from './modules/Footer/Footer'
import PreloadPage from './modules/PreloadPage/PreloadPage'
import BackgroundImageOnLoad from 'background-image-on-load'
import Navigation from './sharedComponents/Navigation/Navigation'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { saveUserIdTokenToLocalStorage } from './sharedFunctions/sharedFunctions'
import { useActivity } from './services/userActivity'
import AppRouter from './modules/Routes/AppRouter'

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG)
firebase.initializeApp(firebaseConfig)

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
    return (
        <Provider store={store}>
            <Router>
                <LocalizationProvider dateAdapter={AdapterMoment}>
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
                        <Navigation />
                        <main>
                            <AppRouter />
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
                </LocalizationProvider>
            </Router>
        </Provider>
    )
}

export default App
