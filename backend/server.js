require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const transcriptionsRoute = require('./routes/transcriptions.js');

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded files (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/transcriptions', transcriptionsRoute);

const passport = require("passport");
require("./config/passport");

// auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/speechtotext';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
