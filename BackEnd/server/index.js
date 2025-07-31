require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const routes = require('./routes/routes');
const usersRoutes = require('./routes/users');
const testRoutes = require('./routes/test');
const dbCheckRoutes = require('./routes/dbCheck');
const bikesRoutes = require('./routes/bikes');
const reviewRoutes = require('./routes/reviewRoutes');
const initDatabase = require('./database/init');
const path = require('path');

// Initialize database
initDatabase().catch(console.error);

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 
};

// Applying CORS with options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Use the logger middleware
app.use(logger);

// Log all incoming requests (after body parser)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', routes);
app.use('/api/users', usersRoutes);
app.use('/api/test', testRoutes);
app.use('/api/db', dbCheckRoutes);
app.use('/api/bikes', bikesRoutes);
app.use('/api/reviews', reviewRoutes); // Mount review routes

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Handle all other routes by returning the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5050;

// Test if database connection works
const db = require('./config/db');

// Test database connection
db.query('SELECT 1')
  .then(() => {
    console.log('Database connection successful');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Testing API endpoint...');
}); 