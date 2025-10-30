import logo from './logo.svg';
import './App.css';
import BidButton from "./bidButton";

function App() {
    const handleBid = (num) => {
        alert(`Bid submitted: ${num}`);
        console.log("Bid submitted:", num);
    }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <BidButton onSubmit={handleBid}/>
      </header>
    </div>
  );
}

export default App;
