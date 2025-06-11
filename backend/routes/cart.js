import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";


const router=Router()

router.post('/cart', authenticateToken, async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity, imageUrl } = req.body;
  
    if (!productId || !quantity || !imageUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const product = await Product.findById(productId).lean();
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const existingCartItem = await Cart.findOne({ user: userId, productId });

      if (existingCartItem) {
        existingCartItem.quantity = quantity;
        await existingCartItem.save();

        return res.status(200).json({
        message: 'Cart item updated',
        cart: existingCartItem,
        });
     }
  
      const cart = new Cart({
        user: userId,
        productId,
        quantity,
        imageUrl,
        productName: product.name,
        productDescription: product.description,
        productPrice: product.price
      });

      const saved = await cart.save();

      res.status(200).json({
        message: 'Cart item added',
        cart: saved
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.get('/cart', authenticateToken, async (req, res) => {
    const userId = req.user._id;

    try {
        const cartItems = await Cart.find({ user: userId })
            .populate('productId', 'name description price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Cart fetched successfully",
            cart: cartItems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/cart/:id', authenticateToken, async (req, res) => {
    try {
      const cartItem = await Cart.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      res.status(200).json({ message: 'Item deleted from cart' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.patch('/cart/:id', authenticateToken, async (req, res) => {
    const userId = req.user._id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;
  
    if (quantity == null || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
  
    try {
      const updated = await Cart.findOneAndUpdate(
        { _id: cartItemId, user: userId },
        { quantity },
        { new: true }
      ).populate('productId', 'name description price');
  
      if (!updated) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      res.status(200).json({
        message: 'Cart item updated',
        cartItem: updated,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
router.delete('/cart', authenticateToken, async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router