const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const cors =  require('cors')

// Basic Initalisation
const app = express();

// To parse JSON request bodies
app.use(express.json());

const PORT = process.env.PORT || 3000;
const routes = require('./routes/index.js');

// Database connection - Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas: ', error);
  });

// CORS Settings
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// File storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes will be written here 
// app.use('/', admin);
app.use('/', routes);

// App Start
app.listen(PORT, (error) => {
  if (!error)
    console.log("Server is Successfully Running, on http://localhost:" + PORT);
  else
    console.log("Error occurred, server can't start", error);
});