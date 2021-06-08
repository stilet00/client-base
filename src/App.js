import "./App.css";
import Karussell from "./modules/Karussell/Karussell";
import Footer from "./modules/Footer/Footer";
import logo from "./images/logo.png";
import React from "react";
import Media from "react-media";
import Gallery from "./modules/Gallery/Gallery";

function App() {
  const gallery = <Gallery />;
  const karusell = <Karussell />;
  return (
    <div className="App">
      <div className="App-header">
        <h2>
          Sunrise <img src={logo} className="App-logo" alt="logo" /> models
        </h2>
      </div>
      <main>
        <Media query="(max-width: 811px)" render={() => <Karussell />} />
        <Media query="(min-width: 812px)" render={() => <Gallery />} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
