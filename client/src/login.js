import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // State for success/error message
  const [messageType, setMessageType] = useState(""); // State to handle message type ('success' or 'error')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear the message before making the request

    try {
      console.log("API URL:", apiUrl);
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });

      // Assuming the API returns a success status or token
      if (response.status === 200) {
        setMessage("Login successful!");
        setMessageType("success");
        // Handle token storage, etc.
        console.log("Response: ", response.data);
        localStorage.setItem('authToken', response.data.token);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error logging in. Please try again."
      );
      setMessageType("error");
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              id="username"
              className="form-control"
              type="text"
              value={username}
              placeholder="Enter your Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              id="password"
              className="form-control"
              type="password"
              value={password}
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>
        </form>

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
      </div>
    </div>
  );
};

export default LoginPage;
