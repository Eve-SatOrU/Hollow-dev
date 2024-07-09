const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);

const PORT = 5000;

async function connectTodb(database_url) {
    try {
        await mongoose.connect(database_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        throw err;
    }
}

async function start() {
    try {
        await connectTodb(process.env.database_url);
        console.log('Connected to the database.');
        app.listen(PORT, function () {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Couldn't connect to the server:", error.message);
    }
}

start();
