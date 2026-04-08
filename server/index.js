require('dotenv').config();

console.log(
  'DATABASE_URL from index:',
  process.env.DATABASE_URL ? 'Loaded' : 'NOT FOUND'
);

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Flask base URL
const FLASK_URL = 'http://localhost:5001';

app.use(cors());
app.use(express.json());

// =========================
// ROUTES
// =========================
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// =========================
// PRICE PREDICTION (EXISTING)
// =========================
app.post('/api/predict', async (req, res) => {
  try {
    const response = await axios.post(
      `${FLASK_URL}/predict/price`,   // ✅ updated endpoint
      req.body
    );

    res.json(response.data);
  } catch (error) {
    console.error('Price prediction error:', error.message);

    if (error.response?.data?.error) {
      return res.status(400).json({ error: error.response.data.error });
    }

    res.status(500).json({ error: 'Failed to get price prediction' });
  }
});

app.post('/api/signal', async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_URL}/signal`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Flask ML bridge signal:', error.message);
        if (error.response && error.response.data && error.response.data.error) {
            return res.status(400).json({ error: error.response.data.error });  
        }
        res.status(500).json({ error: 'Failed to get signal from ML model' });
    }
});

// Health check endpoint
// =========================
// UP/DOWN PREDICTION (NEW)
// =========================
app.post('/api/updown', async (req, res) => {
  try {
    const response = await axios.post(
      `${FLASK_URL}/predict/updown`,
      req.body
    );

    res.json(response.data);
  } catch (error) {
    console.error('UPDOWN error:', error.message);

    if (error.response?.data?.error) {
      return res.status(400).json({ error: error.response.data.error });
    }

    res.status(500).json({ error: 'Failed to get UP/DOWN prediction' });
  }
});

// =========================
// HEALTH CHECK
// =========================
app.get('/api/health', (req, res) => {
  res.json({ status: 'Node.js server is running' });
});

// =========================
// SERVER START
// =========================
app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
  console.log(`Connected to Flask ML at ${FLASK_URL}`);
});