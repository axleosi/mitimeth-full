'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
};

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/product');
        console.log('API response:', res.data);
        setProducts(res.data.products);
      } catch{
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  console.log(products)

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent:'center', marginTop:'15px' }}>
        {products.map((product) => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
            <Link href={`/shop/${product._id}`}>
               <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }} />
           </Link>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
            <p>{product.stock > 0?'In stock' : 'Out of stock'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
