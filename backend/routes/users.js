import { Router } from "express";
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";
import authenticateToken from "../middleware/authenticateToken.js";
import passwordCheck from "../middleware/passwordCheck.js";
import generateToken from '../utils/generateToken.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config();


const JWT_SECRET=process.env.JWT_SECRET
const router=Router()
router.post('/user/signup', async (req, res)=>{
    try {
        const {name, email, password}=req.body
        if(!name || !email || !password){
            return res.status(400).send("Name, email and password required")
        }

        const user= new User({name, email, password});
        const saved= await user.save()

        const token = generateToken(saved)

        res.status(201).json({
            message: "User registered successfully",
            user: saved,
            token
        })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

router.post('/user/login', passwordCheck, async (req, res) => {
    try {
        const user = req.user;

        const newToken = generateToken(user)

        res.status(200).json({
            message: 'Login successful',
            user,
            token: newToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/user/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                email,
                password: hashedPassword
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/user/update', authenticateToken, async (req, res) => {
    try {
        const updates = req.body;
        const userId = req.user._id;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/user/delete', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/user/profile', authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user  
    });
});
export default router