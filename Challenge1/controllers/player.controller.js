const player = require('../models/player.model.js');




const getplayers = async (req,res)=>{
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const Player = await player.find({}).skip(skip).limit(Number(limit));
        const total = await player.countDocuments({});
        res.status(200).json({
            total,
            page: Number(page),
            limit: Number(limit),
            data: Player
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getplayer = async (req,res) => {
    try {

        const { id } = req.params;
        const Player = await player.findById(id);
        res.status(200).json(Player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 
const createplayer =  async (req,res) => {
    try {
        const Player = await player.create(req.body);
        res.status(200).json(Player);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const updatedplayer = async (req, res) => {
    try {
        const { id } = req.params;
        const Player = await player.findByIdAndUpdate(id, req.body);
        if (!Player) {
            return res.status(404).json({ message: "plzyer not found" });
        }
        const updatedPlayer = await player.findById(id);
        res.status(200).json(Player);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteplayer= async (req, res) => {
    try {
        const { id } = req.params;
      const Player = await player.findByIdAndDelete(id);
        if (!Player) {
            return res.status(404).json({ message: "plzyer not found" });
        }

        res.status(200).json({ message: "player deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


module.exports={
    getplayers,
    getplayer,
    createplayer,
    updatedplayer,
    deleteplayer

};