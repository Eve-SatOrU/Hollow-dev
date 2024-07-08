const mongoose = require('mongoose');

async function connectTodb(url){
    await mongoose.connect(url, { 
        dbName: "1_Hornet"
    });
    console.log("Connected to the DATA BASE");
};

module.exports = connectTodb;

