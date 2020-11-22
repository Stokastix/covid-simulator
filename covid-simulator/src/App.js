import logo from './logo.svg';
import './App.css';

import R0Slider from "./R0Slider";


function App() {
  return (
    <div className="App">
      <header className="App-header">

        <img src={logo} className="App-logo" alt="logo" />

        <R0Slider></R0Slider>
      </header>
    </div>
  );
}

export default App;
