require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import userRoutes
const rbacRoutes = require('./routes/rbacRoutes'); // Import rbacRoutes
const connectDB = require('./config/db');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
// Error handling middleware for express.json
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({  message: 'Invalid JSON' } );
  }
  next();
});

app.use(authMiddleware);
app.use('/auth', authRoutes);
app.use('/user', userRoutes); // Use userRoutes
app.use('/rbac', rbacRoutes); // Use rbacRoutes

// Middleware for handling undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not defined' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));