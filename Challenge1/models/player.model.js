const mongoose = require('mongoose');
const playershema =mongoose.Schema(
{

id :{
    type: String,
    required:[true,"enter ur id"],
    default:0,
},

level :{
    type:Number,
    required:true,
    default:0,
},
},
{
  timestamps:true  
}

);

const player = mongoose.model("player",playershema);
module.exports=player;





