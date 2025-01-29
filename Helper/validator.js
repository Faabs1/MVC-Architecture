const validator = require('validator');

const validation = async (req, res, next) => {
    try {
    const { userName,  password, email, } = req.body;

    if(!validator.isLength(userName, {min: 7, max: 30})) {
    return res.status(400).json({ message: 'Username must be between 7 and 30 characters' });
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validator.isStrongPassword(password, {minLength: 8, lowercase: 5, uppercase: 1, numbers: 1, specialChars: 1})){
        return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
    }
    
    next();

} catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: 'Error Validating User' });
}
}

module.exports = validation;