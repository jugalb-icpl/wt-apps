// Import dependencies
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Register route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Error registering user', error: err.message });
    }
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

app.post('/api/force-update', async (req, res) => {
  try {
    console.log('Watchtower triggered');
    
    // Extract token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(400).json({ message: 'Authorization token is required' });
    }

    // Ensure token is in "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    const response = await axios.post(`${process.env.WATCHTOWER_URL}/v1/containers/update`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // Respond with success message
    res.status(200).json({ 
      message: 'Watchtower update triggered successfully!',
      details: response.data
    });
  } catch (err) {
    // Handle error
    console.error('Error in triggering Watchtower:', err.message);
    res.status(500).json({ 
      message: 'Error in triggering Watchtower', 
      error: err.message 
    });
  }
});


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
  console.log(`watchtower api: ${process.env.WATCHTOWER_API_URL}`);
  console.log(`watchtower token: ${process.env.WATCHTOWER_API_TOKEN}`);
});
