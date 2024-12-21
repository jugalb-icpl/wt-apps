// Import dependencies
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow only GET and POST methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));

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
const JWT_SECRET = process.env.JWT_SECRET;

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
// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare entered password with stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Payload (user data)
      JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiry
    );

    // Respond with success message and the generated token
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});


app.post('/api/force-update', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1] || process.env.WATCHTOWER_API_TOKEN; // Get token from request header or use the environment variable token

  if (!token) {
    return res.status(401).json({ message: 'No token provided, access denied.' });
  }

  try {
    // Validate the token (optional - depending on your setup)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }

      // Proceed with making the request to Watchtower API
      axios.post(
        process.env.WATCHTOWER_API_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${process.env.WATCHTOWER_API_TOKEN}`, // Use token from environment or decoded one
          },
        }
      )
        .then(response => {
          res.status(200).json({ message: 'Update successful', data: response.data });
        })
        .catch(error => {
          console.error('Error making request:', error);
          res.status(500).json({ message: 'Error updating container', error: error.message });
        });
    });

  } catch (error) {
    console.error('Error in force-update request:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
  console.log(`watchtower api: ${process.env.WATCHTOWER_API_URL || "not exists"}`);
  console.log(`Job Done: Final True`);
  console.log(`watchtower token: ${process.env.WATCHTOWER_API_TOKEN || "not exists"}`);
});
