const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.jwt_sercret);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

app.get("/users", authenticateToken, function (req, res) {
    res.json(users);
});

app.post("/register", async function (req, res) {
    const { email, fullname, username, password, confirmPassword } = req.body;

    if (!email || !fullname || !username || !password || !confirmPassword) {
        return res.status(400).json({ message: "Invalid input. All fields are required." });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or username." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            email,
            fullname,
            username,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "User registered successfully.",
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                username: newUser.username
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

app.post("/login", async function (req, res) {
    const { email, username, password } = req.body;

    if (!email && !username) {
        return res.status(400).json({ message: "Email or username is required." });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required." });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            return res.status(400).json({ message: "Invalid email, username or password." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email, username or password." });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

const generateToken = (id) => {
    return jwt.sign({ user: { id } }, process.env.jwt_sercret, { expiresIn: '8h' });
};

const PORT = process.env.PORT || 5000;

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
