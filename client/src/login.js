import React, { useState } from "react";
import axios from "axios";

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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>

      {/* Display message */}
      {message && (
        <p style={{ color: messageType === "success" ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginPage;
