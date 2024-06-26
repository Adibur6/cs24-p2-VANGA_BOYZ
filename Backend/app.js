require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import userRoutes
const rbacRoutes = require('./routes/rbacRoutes'); // Import rbacRoutes
const vehicleRoutes = require('./routes/vehicleRoutes'); // Import vehicleRoutes
const stsRoutes = require('./routes/stsRoutes'); // Import stsRoutes
const landfillRoutes = require('./routes/landfillRoutes'); // Import landfillRoutes
const transferWasteRouter = require('./routes/transferRoutes');
const contractorRouter=require('./routes/contractorRoutes');
const workforceRouter=require("./routes/workforceRoutes");
const workforceLogRouter= require('./routes/workforceLogRoutes');
const householdRouter=require('./routes/householdUserRoutes');
const apphandleRouter=require('./routes/apphandleRoutes');
const connectDB = require('./config/db');
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require('cors');

const app = express();

// Connect to MongoDB
//console.log(workforceRouter);
connectDB();
// app.use(cors({ origin: 'http://localhost:4200' }));
app.use(cors());



app.use(express.json());
// Error handling middleware for express.json
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({  message: 'Invalid JSON' } );
  }
  next();
});

app.use('/user', authMiddleware,userRoutes); // Use userRoutes
app.use('/rbac',authMiddleware, rbacRoutes); // Use rbacRoutes
app.use('/vehicles', authMiddleware,vehicleRoutes); // Use vehicleRoutes
app.use('/sts',authMiddleware,stsRoutes); // Use stsRoutes
app.use('/landfill',authMiddleware,landfillRoutes); // Use landfillRoutes
app.use('/transfer-waste',authMiddleware, transferWasteRouter);
app.use('/contractor',authMiddleware,contractorRouter);
app.use('/workforce',authMiddleware,workforceRouter);
app.use('/workforcelog',authMiddleware,workforceLogRouter);
app.use('/auth', authRoutes); // Use authRoutes
app.use('/household',householdRouter);
app.use('/apphandle',apphandleRouter);
// Middleware for handling undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not defined' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));