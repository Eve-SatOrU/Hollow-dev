
const errorHandler = function (err, req, res, next){
    console.error('Error ', err);
    res.status(500).send(err.message);
};

module.exports = errorHandler;


