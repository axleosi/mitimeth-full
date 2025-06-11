'use client';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Checkout from '../components/Checkout';
import { useAppContext } from '../context/appContext';

type CartItem = {
  _id: string;
  productId: Product;
  quantity: number;
  imageUrl: string;
};
type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
};
type GuestCartItem = {
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchCartCount, isLoggedIn, cartItems, setCartItems } = useAppContext();

  const [token, setToken] = useState<string | null>(null);

  // Read token from localStorage only on client side
  useEffect(() => {
    setToken(localStorage.getItem('authToken'));
  }, []);

  const fetchCart = useCallback(async () => {
    if (!token) {
      // Guest cart from localStorage
      const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]') as GuestCartItem[];

      const cartItems: CartItem[] = localCart.map((item, index) => ({
        _id: String(index),
        productId: {
          _id: '',
          name: item.name,
          description: '',
          price: item.price,
          imageUrl: item.imageUrl,
          stock: 0,
        },
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

      setError(null);
      setCartItems(cartItems);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredCartItems = res.data.cart.filter((item: CartItem) => item.productId !== null);
      setCartItems(filteredCartItems);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cart from API:', err);
      setCartItems([]);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  }, [token, setCartItems]);

  const updateCartItemQuantity = async (itemId: string, newQuantity: number) => {
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]') as GuestCartItem[];
      const updatedCart = guestCart.map((item, index) => {
        if (String(index) === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      localStorage.setItem('guestCart', JSON.stringify(updatedCart));

      const updatedCartItems: CartItem[] = updatedCart.map((item, index) => ({
        _id: String(index),
        productId: {
          _id: '',
          name: item.name,
          description: '',
          price: item.price,
          imageUrl: item.imageUrl,
          stock: 0,
        },
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

      setCartItems(updatedCartItems);
      fetchCartCount();
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3000/api/cart/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(prev =>
        prev.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      await fetchCartCount();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const deleteCartItem = async (itemId: string) => {
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]') as GuestCartItem[];
      const updatedCart = guestCart.filter((_, index) => String(index) !== itemId);

      localStorage.setItem('guestCart', JSON.stringify(updatedCart));

      const updatedCartItems: CartItem[] = updatedCart.map((item, index) => ({
        _id: String(index),
        productId: {
          _id: '',
          name: item.name,
          description: '',
          price: item.price,
          imageUrl: item.imageUrl,
          stock: 0,
        },
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

      setCartItems(updatedCartItems);
      fetchCartCount();
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(prev => prev.filter(item => item._id !== itemId));
      await fetchCartCount();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('authToken');
    setToken(tokenFromStorage);

    const loadCart = async () => {
      setLoading(true);
      await fetchCart();
    };

    loadCart();
  }, [fetchCart, isLoggedIn]);

  if (loading) return <p>Loading cart...</p>;
  if (error && token) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="mx-2 md:mx-[10rem]">
      <div className="flex justify-center">
        <div className="w-full py-10">
          <h2 className="text-xl font-semibold text-center pb-6">Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
          ) : (
            <div className="space-y-0 bg-white rounded-md overflow-hidden">
              {/* Header for larger screens */}
              <div className="hidden [@media(min-width:850px)]:grid [grid-template-columns:2fr_1fr_1fr_auto] gap-4 px-4 pt-4 pb-2 text-sm font-semibold text-gray-600">
                <div>Product</div>
                <div>Quantity</div>
                <div>Price</div>
                <div className="text-right">Subtotal</div>
              </div>

              <hr className="hidden md:block border-t border-gray-300 mx-4 mb-2" />

              {cartItems.map((item, index) => {
                return (
                  <React.Fragment key={item._id}>
                    <div className="flex flex-col [@media(min-width:850px)]:grid [grid-template-columns:2fr_1fr_1fr_auto] gap-4 px-4 py-4">
                      {/* Product */}
                      <div className="flex gap-3">
                        <div className="w-16 h-16 border rounded flex items-center justify-center shrink-0">
                          <img
                            src={item.imageUrl || '/hero1.jpg'}
                            alt={item.productId ? item.productId.name : 'Product image'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-start break-all">
                          <span className="font-medium">{item.productId ? item.productId.name : 'Product not available'}</span>
                          <span className="text-sm text-gray-600 break-words max-w-xs">
                            {item.productId ? item.productId.description : 'No description'}
                          </span>
                          <button
                            onClick={() => deleteCartItem(item._id)}
                            className="text-red-500 hover:underline text-sm mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-start">
                        <div className="flex items-center gap-2 border border-black rounded px-2 py-1">
                          <button
                            className="px-2 bg-gray-200 hover:bg-gray-300"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateCartItemQuantity(item._id, item.quantity - 1);
                              }
                            }}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="px-2 bg-gray-200 hover:bg-gray-300"
                            onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-gray-700 font-medium">
                        <span className="md:hidden font-semibold">Price: </span>
                        {item.productId ? `$${item.productId.price.toFixed(2)}` : 'N/A'}
                      </div>

                      {/* Subtotal */}
                      <div className="text-gray-700 font-medium text-right">
                        <span className="md:hidden font-semibold">Subtotal: </span>
                        {item.productId ? `$${(item.quantity * item.productId.price).toFixed(2)}` : 'N/A'}
                      </div>
                    </div>

                    {/* Divider between items */}
                    {index !== cartItems.length - 1 && (
                      <hr className="border-t border-gray-300 mx-4" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Checkout />
    </div>
  );
};

export default Cart;
