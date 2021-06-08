
import './App.css';
import Karussell from "./modules/Karussell/Karussell";
import Footer from "./modules/Footer/Footer";
import logo from "./images/logo.png";
import React from "react";
import Gallery from "./modules/Gallery/Gallery";

function App() {
  return (
    <div className="App">
      <div className="App-header">
          <h2>Sunrise  <img src={logo} className="App-logo" alt="logo" /> models</h2>

      </div>
        <main>
            {/*<Karussell />*/}
            <Gallery />
        </main>
        <Footer />
    </div>
  );
}

export default App;
