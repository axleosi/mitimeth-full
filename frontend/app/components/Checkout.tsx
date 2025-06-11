'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/appContext';

type GuestCartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

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

const Checkout = () => {
  const router = useRouter();
  const [address, setAddress] = useState({ state: '', lga: '', street: '' });
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const token = localStorage.getItem('authToken');
  const { fetchCartCount, isLoggedIn, setShowLogin, cartItems, setCartItems } = useAppContext();

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        const localCart: GuestCartItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const guestItems: CartItem[] = localCart.map((item, index) => ({
          _id: String(index),
          productId: {
            _id: item.productId,
            name: item.name,
            description: '',         
            price: item.price,
            imageUrl: item.imageUrl,
            stock: 1,                
          },
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        }));
        setCartItems(guestItems);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data.cart);
      } catch {
        toast.error('Failed to load cart items.');
      }
    };

    fetchCart();
  }, [token]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const finalTotal = totalPrice;

  const handleOrderSubmit = async () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return; 
    }

    const { state, lga, street } = address;

    if (!state || !lga || !street.trim()) {
      toast.error('Please complete all address fields.');
      return;
    }

    if (!phoneNumber.trim() || !/^[0-9]{10,14}$/.test(phoneNumber)) {
      toast.error('Enter a valid phone number.');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const items = cartItems
        .filter((item) => item.productId)
        .map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          priceAtOrderTime: item.productId.price,
          nameAtOrderTime: item.productId.name,
        }));

      await axios.post(
        `http://localhost:3000/api/orders`,
        {
          items,
          address: `${street}, ${lga}, ${state}`,
          totalAmount: totalPrice,
          phoneNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Order placed successfully!');
      setCartItems([]);
      setAddress({ state: '', lga: '', street: '' });
      await fetchCartCount();
      setTimeout(() => router.push('/'), 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || 'Failed to place order.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 [@media(min-width:900px)]:grid-cols-2 gap-[5.3rem] mt-[4.9rem]">
      {/* Delivery Address Section */}
      <div className="w-full space-y-4 p-4 border border-black rounded-md">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <div>
          <label className="block mb-1">State</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={address.state}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, state: e.target.value, lga: '' }))
            }
            required
            placeholder="Enter your state"
          />
        </div>
        <div>
          <label className="block mb-1">Local Government Area</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={address.lga}
            onChange={(e) => setAddress((prev) => ({ ...prev, lga: e.target.value }))}
            required
            placeholder="Enter your LGA"
          />
        </div>
        <div>
          <label className="block mb-1">Street Address</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={address.street}
            onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
            placeholder="e.g. 123 Lekki Phase 1"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full border rounded p-2 text-sm"
            pattern="^[0-9]{10,14}$"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="e.g. 08012345678"
          />
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="w-full space-y-4 p-4 border border-black rounded-md flex flex-col justify-evenly">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="space-y-2 ">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {/* Optionally map cart items here */}
            </ul>
          )}
        </div>
        <hr />
        <div className="flex justify-between font-semibold">
          <span>Item Total:</span>
          <span>₦{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Delivery Fee:</span>
          <span className='text-right'>Decide based on location</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₦{finalTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mt-4 w-[90%] mx-auto">
          <button
            onClick={handleOrderSubmit}
            disabled={loading || cartItems.length === 0}
            className="bg-purple-300 text-white px-6 py-2 rounded hover:bg-purple-500 disabled:opacity-50 w-full"
          >
            {loading ? 'Placing Order...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
