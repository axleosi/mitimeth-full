import { Router } from "express";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import authenticateToken from "../middleware/authenticateToken.js";
import requireAdmin from "../middleware/requireAdmin.js"

const router=Router()

router.post('/orders', authenticateToken, async (req, res) => {
    const userId = req.user._id;
    try {
        const {
            items,
            totalAmount,
            address,
            phoneNumber
        } = req.body;

        if (!items || !address || !totalAmount ||!phoneNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const userDoc = await User.findById(userId);
        if (!userDoc) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newOrder = new Order({
            user:userId,
            userName:userDoc.name,
            items,
            totalAmount,
            address,
            phoneNumber
        });

        const savedOrder = await newOrder.save();

        await Cart.deleteMany({ user: userId });

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/order', authenticateToken, async (req, res) => {
    const userId = req.user._id;
    try {
        const orders = await Order.find({ user: userId }).populate('user', 'name');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/order/admin', requireAdmin, async (req, res) => {
  try {

    const orders = await Order.find().populate('user', 'name').populate('items.product', 'name');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router