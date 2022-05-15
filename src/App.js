import "./App.css";
import "./styles/modules/karusell.css";
import "./styles/modules/Gallery.css";
import "./styles/modules/ClientsForm.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AuthorizationPage from "./modules/AuthorizationPage/AuthorizationPage";
import TaskList from "./modules/TaskList/TaskList";
import ChartsContainer from "./modules/Charts/ChartsContainer";
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
} from "@react-firebase/auth";
import { firebaseConfig } from "./fireBaseConfig";
import Translators from "./modules/Translators/Translators";
import Overview from "./modules/Overview/Overview";
import sun from "../src/images/sun_transparent.png";
import background from "../src/images/main-background-2.png";
import Footer from "./modules/Footer/Footer";
import PreloadPage from "./modules/PreloadPage/PreloadPage";
import BackgroundImageOnLoad from "background-image-on-load";
import Navigation from "./sharedComponents/Navigation/Navigation";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function App() {
  const [isLoaded, setIsLoaded] = useState(true);

  const stopLoading = () => {
    setIsLoaded(false);
  };

  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
          <PreloadPage isLoaded={isLoaded} />
          <div
            className={isLoaded ? "App invisible" : "App"}
            style={{ background: isLoaded ? "white" : `url(${background})` }}
          >
            <div className="sun">
              <img src={sun} alt="Sun" width={"150px"} height={"150px"} />
            </div>
            <FirebaseAuthConsumer>
              {({ user }) => {
                return <Navigation user={user} />;
              }}
            </FirebaseAuthConsumer>
            <main>
              <FirebaseAuthConsumer>
                {({ user }) => {
                  return (
                    <Switch>
                      <Redirect from="/overview/*" to="/overview" />
                      <Route path="/overview">
                        <Overview user={user} />
                      </Route>
                      <Route path="/tasks/">
                        <TaskList user={user} />
                      </Route>
                      <Route path="/translators/">
                        <Translators user={user} />
                      </Route>
                      <Redirect from="/chart/*" to="/chart" />
                      <Route path="/chart">
                        <ChartsContainer user={user} />
                      </Route>
                      <Route path="/" exact>
                        <AuthorizationPage />
                      </Route>
                      <Redirect from="/*" to="/" />
                    </Switch>
                  );
                }}
              </FirebaseAuthConsumer>
            </main>
            <Footer />
          </div>
          <BackgroundImageOnLoad
            src={background}
            onLoadBg={() => {
              setTimeout(stopLoading, 1000);
            }}
            onError={(err) => console.log("error", err)}
          />
        </FirebaseAuthProvider>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
