const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.jwt_sercret);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const generateToken = (id) => {
    return jwt.sign({ user: { id } }, process.env.jwt_sercret, { expiresIn: '8h' });
};

module.exports = { authenticateToken, generateToken };
