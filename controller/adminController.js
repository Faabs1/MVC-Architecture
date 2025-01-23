const User = require('../model/userSchema');



const AdminSignup = async (req, res) => {
    try {
        const { userName, password, email, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            userName,
            password: hashedPassword,
            email,
            role: 'admin'
        });
        
        await user.save();
        
        return res.status(200).json({ message: 'User created successfully', user });
        
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
                id: user._id,
                role: user.role
            };
            const token = jwt.sign(payload, 
                process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({message: 'user logged in successfully',token: token});
        }catch (error) {
        return res.status(500).json({ msg: 'Internal server error' });
    
}
}


module.exports = {AdminSignup, AdminLogin,};