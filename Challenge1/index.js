
const express = require('express')
const mongoose = require('mongoose');
const connectDB = require('./database/db.js');
const player = require('./models/player.model.js');
const playerRoute =require('./routes/player.route.js');
const notFoundMiddleware = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const app = express()
const dotenv = require("dotenv");
dotenv.config();



//middleware
app.use(express.json());
app.use(errorHandlerMiddleware);


// routes
app.use('/api/player',playerRoute);

// hqdi test berk 
app.get('/', (req, res) => {
    res.send("hello from node api server yacine ");
});

connectDB();
// yebda server yekhdam
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});















