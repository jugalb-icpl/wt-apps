import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { REACT_APP_API_URL } = process.env;
const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for feedback message
  const [messageType, setMessageType] = useState(""); // State to handle message type ('success' or 'error')

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${REACT_APP_API_URL}/register`, {
        username,
        password,
      });

      // Handle successful registration
      console.log(response.data);
      setMessage('Registration successful! You can now log in.');
      setMessageType('success');
    } catch (error) {
      console.error('Error registering:', error);
      setMessage('Registration failed. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="my-4">Sign up</h1>

        {/* Display message */}
        {message && (
          <p
            className={`mt-3 text-center ${
              messageType === "success" ? "text-success" : "text-danger"
            }`}
          >
            {message}
          </p>
        )}

        {/* Register form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              placeholder="Enter your Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
          <button className="btn btn-primary w-100" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
