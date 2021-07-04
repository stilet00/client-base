import "./App.css";
import Karussell from "./modules/Clients/Karussell/Karussell";
import logo from "./images/logo.png";
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
import Unauthorized from "./shared/Unauthorized/Unauthorized";
import TaskList from "./modules/TaskList/TaskList";
import Chart from "./modules/Chart/Chart";

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
            <Route path="/clients/true/add">

            </Route>
            <Route path="/clients/:status">
              <Media query="(max-width: 811px)" render={() => <Karussell />} />
              <Media query="(min-width: 812px)" render={() => <Gallery />} />
            </Route>
            <Route path="/clients/">
              <Unauthorized />
            </Route>
            <Route path="/tasks/">
              <TaskList />
            </Route>
            <Redirect from="/chart/*" to="/chart/" />
            <Route path="/chart/">
              <Chart />
            </Route>
            <Route path="/" exact>
              <AuthorizationPage />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
