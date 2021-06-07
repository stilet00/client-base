import logo from './images/logo.png';
import './App.css';
import Karussell from "./modules/Karussell/Karussell";
import Footer from "./modules/Footer/Footer";

function App() {
  return (
    <div className="App">
      <div className="App-header">
          <Karussell />
      </div>
        <Footer />
    </div>
  );
}

export default App;
