import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import './App.css';
import LoginPage from './login';
import RegisterPage from './register';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Router> {/* Wrap the app in Router to enable routing */}
        <Routes>
          {/* Define the routes for different pages */}
          <Route path="/" element={<LoginPage />} /> {/* Route for LoginPage */}
          <Route path="/register" element={<RegisterPage />} /> {/* Route for RegisterPage */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
