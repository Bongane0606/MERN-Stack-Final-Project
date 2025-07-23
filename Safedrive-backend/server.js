const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Create Express app
const app = express();

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handler
io.on('connection', socket => {
  console.log('New client connected');

  // Join a room based on user ID
  socket.on('join', userId => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Join emergency responders room
  socket.on('join-responders', () => {
    socket.join('emergency-responders');
    console.log('Emergency responder joined');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Add io instance to app for use in controllers
app.set('io', io);

// Global middleware
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Body parser
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/trips', require('./routes/trips'));
app.use('/api/v1/rewards', require('./routes/rewards'));
app.use('/api/v1/emergencies', require('./routes/emergencies'));

// Error handling middleware
app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});