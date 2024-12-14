import logo from './logo.svg';
import './App.css';
import LoginPage from './login';
import RegisterPage from './register';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        
          Learn React
        </a>
      </header> */}
      <img src={logo} className="App-logo" alt="logo" />
      <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
      <LoginPage />
      <RegisterPage />
    </div>
  );
}

export default App;
