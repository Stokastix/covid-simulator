import logo from './logo.svg';
import './App.css';

import R0Slider from "./R0Slider";
import ChartWrapper from './ChartWrapper';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ChartWrapper />
        <R0Slider />
      </header>
    </div>
  );
}

export default App;
