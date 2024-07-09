const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB=require("./db/db");
dotenv.config();
connectDB()
const app = express();
app.get("/",(req,res)=>{

    res.send (" api is working good ");
})

app.get('/api/chat',(req,res)=>{

res.send(chats)

});

app.get("/api/chat/:id",(req,res)=>{

const singlechat = chats.find((c)=>c._id=== req.params.id);
res.send(singlechat);
});


const PORT = process.env.PORT || 2000;
//`${PORT}`

app.listen(2000,console.log(`server is running on ${PORT}`));