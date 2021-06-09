import "./App.css";
import Karussell from "./modules/Karussell/Karussell";
import Footer from "./modules/Footer/Footer";
import logo from "./images/logo.png";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Media from "react-media";
import Gallery from "./modules/Gallery/Gallery";
import AuthorizationPage from "./modules/AuthorizationPage/AuthorizationPage";
import Unauthorized from "./shared/Unauthorized/Unauthorized";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <h2>
            Sunrise <img src={logo} className="App-logo" alt="logo" /> models
          </h2>
        </div>
        <main>
          <Switch>
            <Route path="/clients/:status">
              <Media query="(max-width: 811px)" render={() => <Karussell />} />
              <Media query="(min-width: 812px)" render={() => <Gallery />} />
            </Route>
            <Route path="/clients/">
              <Unauthorized />
            </Route>
            <Route path="/" exact>
              <AuthorizationPage />
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
