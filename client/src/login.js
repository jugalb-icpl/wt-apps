import React, { useState } from "react";
import axios from "axios";
// require('dotenv').config();

const apiUrl = process.env.REACT_APP_API_URL;
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("api url:", apiUrl);
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });

      // Handle successful login, e.g., store the token in localStorage
      console.log(response.data);
    } catch (error) {
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
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
