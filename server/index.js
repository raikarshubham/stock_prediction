require('dotenv').config();
console.log('DATABASE_URL from index:', process.env.DATABASE_URL ? 'Loaded' : 'NOT FOUND');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const FLASK_URL = 'http://localhost:5001';

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// API endpoint that React client will call
app.post('/api/predict', async (req, res) => {
    try {
        // Forward the request body to the Flask ML bridge
        const response = await axios.post(`${FLASK_URL}/predict`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Flask ML bridge:', error.message);
        // If Flask throws a specific error (like invalid ticker), pass it forward
        if (error.response && error.response.data && error.response.data.error) {
            return res.status(400).json({ error: error.response.data.error });
        }
        res.status(500).json({ error: 'Failed to get prediction from ML model' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Node.js server is running' });
});

app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
    console.log(`Expecting Flask ML bridge on ${FLASK_URL}`);
});
