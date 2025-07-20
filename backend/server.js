// --- Imports ---
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');

// Configure environment variables
require('dotenv').config();


// --- Initializations ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // Configure CORS for Socket.IO to allow all connections
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Configure CORS for Express
app.use(cors());

const PORT = 3001;
const NASA_API_KEY = process.env.NASA_API_KEY;


// --- REST API Endpoints ---

// 1. Get Live ISS Location
app.get('/api/iss-location', async (req, res) => {
  try {
    const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching ISS location:", error.message);
    res.status(500).json({ message: 'Error fetching ISS location' });
  }
});


// 2. Get Mars Weather from NASA InSight Lander
app.get('/api/mars-weather', async (req, res) => {
  // Guard clause to check if the API key is provided
  if (!NASA_API_KEY || NASA_API_KEY === 'YOUR_API_KEY_HERE') {
    return res.status(400).json({ message: 'NASA API key is missing or invalid. Please check your .env file.' });
  }
  try {
    const response = await axios.get(`https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`);
    const solKeys = response.data.sol_keys;

    if (!solKeys || solKeys.length === 0) {
      return res.status(404).json({ message: 'No weather data available from InSight.' });
    }

    // Get the data for the most recent Martian day (sol)
    const latestSolKey = solKeys[solKeys.length - 1];
    const latestSolData = response.data[latestSolKey];

    res.json({
        sol: latestSolKey,
        avg_temp: latestSolData.AT?.av ?? 'N/A',
        pressure: latestSolData.PRE?.av ?? 'N/A',
        wind_speed: latestSolData.HWS?.av ?? 'N/A',
    });
  } catch (error) {
    console.error("Error fetching Mars weather:", error.message);
    res.status(500).json({ message: 'Error fetching Mars weather data. Check your API key.' });
  }
});


// 3. Get upcoming Near-Earth Objects (NEOs)
app.get('/api/neos', async (req, res) => {
  // Guard clause to check if the API key is provided
  if (!NASA_API_KEY || NASA_API_KEY === 'YOUR_API_KEY_HERE') {
    return res.status(400).json({ message: 'NASA API key is missing or invalid. Please check your .env file.' });
  }
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&api_key=${NASA_API_KEY}`);
    const neoDataByDate = response.data.near_earth_objects;
    
    let upcomingNeos = [];
    Object.keys(neoDataByDate).forEach(date => {
      neoDataByDate[date].forEach(neo => {
        upcomingNeos.push({
          id: neo.id,
          name: neo.name,
          close_approach_date: neo.close_approach_data[0].close_approach_date_full,
          miss_distance_km: parseFloat(neo.close_approach_data[0].miss_distance.kilometers).toFixed(0),
          estimated_diameter_m: ((neo.estimated_diameter.meters.estimated_diameter_min + neo.estimated_diameter.meters.estimated_diameter_max) / 2).toFixed(2),
        });
      });
    });

    // Sort by date and return the top 10 closest approaches
    upcomingNeos.sort((a, b) => new Date(a.close_approach_date) - new Date(b.close_approach_date));
    res.json(upcomingNeos.slice(0, 10));

  } catch (error) {
    console.error("Error fetching NEO data:", error.message);
    res.status(500).json({ message: 'Error fetching NEO data. Check your API key.' });
  }
});


// --- WebSocket Logic for Live Telemetry ---
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Start emitting simulated telemetry data every second
  const telemetryInterval = setInterval(() => {
    socket.emit('telemetryData', {
      timestamp: new Date().toISOString(),
      altitude: 408.5 + (Math.random() - 0.5) * 10,
      velocity: 27600.2 + (Math.random() - 0.5) * 50,
      temperature: 20.1 + (Math.random() - 0.5) * 10,
      voltage: 120.5 + (Math.random() - 0.5) * 2,
      battery: 98.6 - Math.random() * 0.1,
      signal: -75.3 + (Math.random() - 0.5) * 5,
    });
  }, 1000);

  // Clean up when the client disconnects to prevent memory leaks
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    clearInterval(telemetryInterval);
  });
});


// --- Start the Server ---
server.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});