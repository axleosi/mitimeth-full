import User from "../models/userModel.js"
import bcrypt from 'bcrypt'

const passwordCheck = async (req, res, next) => {
    const { email, password } = req.body;


    try {
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export default passwordCheck