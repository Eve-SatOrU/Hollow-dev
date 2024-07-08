const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.DB_URL)
    .then(() => {
            console.log("connected to database!");
        })
        .catch((err) => {
            console.error("Connection failed!", err.message);
            process.exit(1);
        });
    }
    
 

 module.exports = connectDB;