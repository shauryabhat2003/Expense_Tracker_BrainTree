// Load environment variables from .env file
require('dotenv').config();

// server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db'); // MongoDB connection
const authRoutes = require('./routes/auth'); // Authentication routes
const expenseRoutes = require('./routes/expenses'); // Expense routes
const braintreeRoutes = require('./routes/braintree'); // Braintree routes

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Apply security-related HTTP headers using Helmet
app.use(helmet()); 

// Enable CORS for cross-origin requests
app.use(cors()); 

// Built-in middleware for parsing JSON and URL-encoded data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Logging requests using Morgan
app.use(morgan('dev'));

// Mount the routes
app.use('/api/auth', authRoutes); // Authentication-related routes
app.use('/api/expenses', expenseRoutes); // Expense tracker routes
app.use('/api/braintree', braintreeRoutes); // Payment processing routes via Braintree

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// Set the port from environment variables or use default (5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));