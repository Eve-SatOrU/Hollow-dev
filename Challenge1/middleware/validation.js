const Joi = require('@hapi/joi');
const { id } = require('@hapi/joi/lib/base');


const playerSchema = Joi.object({
    id: Joi.string().min(1).max(15).required(),
    level: Joi.number().integer().min(0).max(101).required()
});

module.exports = playerSchema;


const validatePlayer = (req, res, next) => {
    const { error } = playerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validatePlayer;