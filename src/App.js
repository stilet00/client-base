import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css'
import './styles/modules/karusell.css'
import './styles/modules/Gallery.css'
import './styles/modules/ClientsForm.css'
import { useState, useEffect } from 'react'
import { Provider as ReduxStorProvider } from 'react-redux'
import store from './store/store'
import { BrowserRouter as Router } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'
import sun from '../src/images/sun_transparent.png'
import lightThemeBackground from '../src/images/main-background-2.png'
import darkThemeBackground from '../src/images/background-dark-theme.png'
import Footer from './modules/Footer/Footer'
import PreloadPage from './modules/PreloadPage/PreloadPage'
import BackgroundImageOnLoad from 'background-image-on-load'
import Navigation from './sharedComponents/Navigation/Navigation'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { saveUserIdTokenToLocalStorage } from './sharedFunctions/sharedFunctions'
import { useActivity } from './services/userActivity'
import AppRouter from './modules/Routes/AppRouter'
import useNightTime from './sharedHooks/useNightTime'
import AuthProvider from './modules/Providers/AuthProvider'

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG)
firebase.initializeApp(firebaseConfig)
const queryClient = new QueryClient()

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const [theme, setTheme] = useState({
        colors: {
            backgroundMode: 'rgba(255, 255, 255, 0.5)',
        },
        fonts: {
            main: 'Arial, sans-serif',
        },
    })
    const { loggedIn } = useActivity()
    const stopLoading = () => {
        setIsLoading(false)
    }
    const shouldShowDarkTheme = useNightTime()
    const mainBackgroundImage = shouldShowDarkTheme
        ? darkThemeBackground
        : lightThemeBackground
    useEffect(() => {
        if (shouldShowDarkTheme) {
            setTheme(prevTheme => ({
                ...prevTheme,
                colors: {
                    ...prevTheme.colors,
                    backgroundMode: 'rgba(255, 255, 255, 1)',
                },
            }))
        }
    }, [shouldShowDarkTheme])
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
        <QueryClientProvider client={queryClient}>
            <ReduxStorProvider store={store}>
                <Router>
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <AuthProvider>
                                <PreloadPage isLoading={isLoading} />
                                <div
                                    className={
                                        isLoading ? 'App invisible' : 'App'
                                    }
                                    style={{
                                        background: isLoading
                                            ? 'white'
                                            : `url(${mainBackgroundImage})`,
                                    }}
                                >
                                    {!shouldShowDarkTheme && (
                                        <div className="sun">
                                            <img
                                                src={sun}
                                                alt="Sun"
                                                width={'150px'}
                                                height={'150px'}
                                            />
                                        </div>
                                    )}
                                    {shouldShowDarkTheme && (
                                        <>
                                            <div
                                                className="stars"
                                                style={{
                                                    background: `black url(${mainBackgroundImage}) repeat`,
                                                }}
                                            />
                                            <div className="twinkling" />
                                        </>
                                    )}

                                    <Navigation />
                                    <main>
                                        <AppRouter />
                                    </main>
                                    <Footer />
                                </div>
                                <BackgroundImageOnLoad
                                    src={mainBackgroundImage}
                                    onLoadBg={() => {
                                        setTimeout(stopLoading, 1000)
                                    }}
                                    onError={err => console.log('error', err)}
                                />
                            </AuthProvider>
                        </LocalizationProvider>
                    </ThemeProvider>
                </Router>
            </ReduxStorProvider>
        </QueryClientProvider>
    )
}

export default App
