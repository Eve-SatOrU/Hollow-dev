const jwt = require ("jsonwebtoken");

function generateToken(id){
    const token = jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            username: user.username 
        },
        process.env.jwt_secret
    );
    return token;
}

module.exports = generateToken;