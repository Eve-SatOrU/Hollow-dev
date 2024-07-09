const mongoose = require('mongoose');

async function connectTodb(url){
    await mongoose.connect(url, { 
        dbName: "Traitor Lord",
    });
    console.log("Connected to the DATA BASE");
};

module.exports = connectTodb;

