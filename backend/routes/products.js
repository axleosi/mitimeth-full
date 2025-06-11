import { Router } from "express";
import Product from "../models/productModel.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router=Router()

router.post('/product',authenticateToken, async(req, res)=>{
    const { name, description, price, imageUrl, stock } = req.body;

    try {
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const product = new Product({
            name,
            description,
            price,
            imageUrl,
            stock: stock !== undefined ? stock : undefined,
        });

        const saved = await product.save();

        res.status(201).json({
            message: "Product created successfully",
            product: saved,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.get('/product', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json({ products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
  });

router.get('/product/:id', async (req, res) => {
  const { id } = req.params;
  console.log('hello', id);
  
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ product }); // ✅ change from `products` to `product`
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
});

export default router