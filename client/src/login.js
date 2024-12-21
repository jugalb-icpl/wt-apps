import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
console.log("Environment Variable - API URL:", process.env.REACT_APP_API_URL);

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // State for success/error message
  const [messageType, setMessageType] = useState(""); // State to handle message type ('success' or 'error')
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear the message before making the request
  
    // Client-side validation
    if (!username || !password) {
      setMessage("Username and password are required.");
      setMessageType("error");
      return;
    }
  
    try {
      console.log("API URL:", apiUrl);
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });
      if (response.status === 200) {
        setMessage("Login successful!");
        setMessageType("success");
        setIsLoggedIn(true); // Set logged in status to true
        console.log("Response: ", response.data);
        localStorage.setItem('authToken', response.data.token); // Store token
      } else {
        throw new Error("Unexpected response status."); // Handle unexpected success status
      }
    } catch (error) {
      // Check for response errors
      if (error.response) {
        const status = error.response.status;
        const errorMessage =
          error.response.data?.message ||
          (status === 401
            ? "Invalid credentials. Please check your username and password."
            : "An error occurred. Please try again.");
  
        setMessage(errorMessage);
        setMessageType("error");
      } else if (error.request) {
        // Network error or no response
        setMessage("No response from the server. Please check your internet connection.");
        setMessageType("error");
      } else {
        // Any other error
        setMessage("An unexpected error occurred. Please try again.");
        setMessageType("error");
      }
      console.error("Error logging in:", error);
    }
  };
  

  // Handle "Update running container" button click
  const handleForceUpdate = async () => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage

    if (!token) {
      setMessage("No valid token found. Please log in first.");
      setMessageType("error");
      return;
    }
    setMessage("Checking for updates.....");
    try {
      // Send force-update request with token in the Authorization header
      const response = await axios.post(
        `${apiUrl}/force-update`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      setMessage("Update successful!");
      setMessageType("success");
      console.log("Force update response:", response.data);
    } catch (error) {
      setMessage("Error updating container. Please try again.");
      setMessageType("error");
      console.error("Error making force-update request:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="my-4">Login here</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
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
          <button className="btn btn-dark w-100" type="submit">
            Login
          </button>
        </form>

        {/* Conditionally render the "Update running container" button */}
        {isLoggedIn && (
          <button
            className="btn btn-success w-100 mt-3"
            type="button"
            onClick={handleForceUpdate} // Trigger the force update action
          >
            Update running container
          </button>
        )}

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
