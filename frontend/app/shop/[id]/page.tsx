'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppContext } from '@/app/context/appContext';



const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const {
    fetchProduct,
    product,
    loading,
    error,
    quantity,
    setQuantity,
    isLoggedIn,
    addToCart
  } = useAppContext();

  const [cartError, setCartError] = useState<string | null>(null);
  const [cartSuccess, setCartSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (productId) fetchProduct(productId);
  }, [productId]);

  const increment = () => {
    if (product && quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (product) {
        await addToCart(product, quantity, product.imageUrl);
        setCartSuccess('Product added to cart!');
        setCartError(null);
      }
    } catch (err: any) {
      setCartError('Failed to add to cart: ' + (err.response?.data?.message || err.message));
      setCartSuccess(null);
    }
  };

  const checkOut = async () => {
    if (!isLoggedIn) {
      router.push('/signup');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setCartError('No auth token found. Please log in again.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/api/cart',
        {
          productId: product?._id,
          quantity,
          imageUrl: product?.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartSuccess('Product added to cart!');
      setCartError(null);
      router.push('/cart')
    } catch (err: any) {
      setCartError('Failed to add to cart: ' + (err.response?.data?.message || err.message));
      setCartSuccess(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-6xl w-full px-6 mx-auto py-10">
      <p className="text-sm text-gray-500">
        <button onClick={()=>router.push('/')}><span>Home/</span></button>  
        <button onClick={()=>router.push('/shop')}><span>Products</span> /</button>{' '}
        <span className="text-indigo-500">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-6 md:items-center">
        {/* Single Big Image */}
        <div className="border border-gray-300 rounded overflow-hidden w-full md:max-w-md flex justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-w-xs md:max-w-md object-contain"
          />
        </div>

        {/* Info and Actions */}
        <div className="w-full text-sm md:w-1/2 md:self-center">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="mt-4">
            <p className="text-gray-500/70">${product.price}</p>
          </div>

          <div className="mt-6">
            <p className="text-base font-medium">About Product</p>
            <p className="mt-4 text-gray-600">{product.description}</p>
          </div>

          {/* Quantity Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={decrement}
              disabled={quantity <= 1}
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={increment}
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center mt-6 gap-4 text-base">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 font-medium transition"
            >
              Add to Cart
            </button>
            <button onClick={checkOut}
              className="w-full py-3.5 bg-indigo-500 text-white hover:bg-indigo-600 font-medium transition"
            >
              Buy Now
            </button>
          </div>

          {/* Messages */}
          {cartSuccess && <p className="text-green-600 mt-2">{cartSuccess}</p>}
          {cartError && <p className="text-red-600 mt-2">{cartError}</p>}
        </div>
      </div>
    </div>
  );
};
export default ProductPage;