const express = require("express");
const mongoose = require('mongoose');
const tasksRouter = require('./routes/tasks');
const path = require("path");
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(express.json());

app.use('/api/tasks', tasksRouter);

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "frontend")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
