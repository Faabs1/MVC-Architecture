const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const isAuthenticated = async (req, res, next) => {
    try {
        const token = await req.header.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'User not authorised' });
        }
        const data = jwt.verify(token, process.env.JWT_SECRET);
        if (!data) {
            return res.status(401).json({ msg: 'invalid Token' });
        }
        req.user = data
        next();   
} catch (error) {
    console.log(error);
    
    return res.status(500).json({ msg: 'Internal error' });
}
}

module.exports = isAuthenticated;