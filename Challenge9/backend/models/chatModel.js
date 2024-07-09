const mongoose =  require (' mongoose')


const chatModel = mongoose.Shema(
    {
        chatName:{type:String, trim:true},
        isGroupChat:{type:Boolean,default:false},
        users:[{
            type:mongoose.Shema.type.ObjectId,
            ref:"User",
        },],

letestMessage:{
 type:mongoose.Shema.type.ObjectId,
            ref:"Messages",
    },

groupAdmin:{
 type:mongoose.Shema.type.ObjectId,
            ref:"user",
    },
},
);
const Chat = mongoose.model("chat",chatModel);
module.exports=Chat;
