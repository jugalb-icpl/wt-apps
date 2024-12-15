import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for feedback message
  const [messageType, setMessageType] = useState(""); // State to handle message type ('success' or 'error')

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/register`, {
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
    <div>
      <h1>Register</h1>
      {message && <p style={{ color: messageType === "success" ? "green" : "red" }}>{message}</p>} {/* Display the message */}
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
