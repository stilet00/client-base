import "./App.css";
import Karussell from "./modules/Clients/Karussell/Karussell";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Media from "react-media";
import Gallery from "./modules/Clients/Gallery/Gallery";
import AuthorizationPage from "./modules/AuthorizationPage/AuthorizationPage";
import TaskList from "./modules/TaskList/TaskList";
import ChartsContainer from "./modules/ChartsContainer/ChartsContainer";
import firebase from "firebase/app";
import "firebase/auth";
import { FirebaseAuthProvider } from "@react-firebase/auth";
import { firebaseConfig } from "./fireBaseConfig";
import LogoHeader from "./sharedComponents/LogoHeader/LogoHeader";
import Translators from "./modules/Translators/Translators";
import Overview from "./modules/Overview/Overview";
import sun from "../src/images/sun_transparent.png";
import Footer from "./modules/Footer/Footer";

function App() {
  return (
    <Router>
      <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
        <div className="App">
          <div className="sun">
            <img src={sun} alt="Sun" width={"150px"} height={"150px"} />
          </div>
          <LogoHeader />
          <main>
            <Switch>
              <Route path="/clients">
                <Media
                  query="(max-width: 811px)"
                  render={() => <Karussell />}
                />
                <Media query="(min-width: 812px)" render={() => <Gallery />} />
              </Route>
              <Redirect from="/overview/*" to="/overview" />
              <Route path="/overview">
                <Overview />
              </Route>
              <Route path="/tasks/">
                <TaskList />
              </Route>
              <Route path="/translators/">
                <Translators />
              </Route>
              <Redirect from="/chart/*" to="/chart" />
              <Route path="/chart">
                <ChartsContainer />
              </Route>
              <Route path="/" exact>
                <AuthorizationPage />
              </Route>
              <Redirect from="/*" to="/" />
            </Switch>
          </main>
          <Footer />
        </div>
      </FirebaseAuthProvider>
    </Router>
  );
}

export default App;
