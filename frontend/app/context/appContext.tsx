'use client'
import React from 'react'
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
};

type CartItem = {
  _id: string;
  productId: Product;
  quantity: number;
  imageUrl: string;
};

type GuestCartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

interface AppContextType {
  product: Product | null;
  setProduct: (product: Product | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  fetchProduct: (productId: string) => Promise<void>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  cartCount: number;
  setCartCount: (count: number) => void;
  fetchCartCount: () => Promise<void>;
  addToCart: (product: Product, quantity: number, imageUrl: string) => Promise<void>;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  showLogin: boolean;
  showSignUp: boolean;
  setShowLogin: (value: boolean) => void;
  setShowSignUp: (value: boolean) => void;
}

interface JwtPayload {
  exp: number;
}



const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    let resolved = false;

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('guestCart');
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
          resolved = true;
        }
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('guestCart');
        setIsLoggedIn(false);
      }
    }

    if (!token || resolved) {
      fetchCartCount();
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);

    const guestCart: GuestCartItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');
    if (guestCart.length > 0) {
      try {
        await Promise.all(
          guestCart.map((item) =>
            axios.post(
              `http://localhost:3000/api/cart`,
              {
                productId: item.productId,
                quantity: item.quantity,
                imageUrl: item.imageUrl,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
        localStorage.removeItem('guestCart');
      } catch (err: any) {
        console.error('Failed to sync guest cart:', err.message || err);
      }
    }

    await fetchCartCount();
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        await axios.delete(`http://localhost:3000/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err: any) {
        console.error('Failed to clear backend cart:', err.message || err);
      }
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('guestCart');
    setIsLoggedIn(false);
    setCartCount(0);
    setProduct(null);
    setShowLogin(false);
    setShowSignUp(false);
    setCartItems([]);
    router.push('/');
  };



  const fetchProduct = useCallback(async (productId: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/product/${productId}`);
      setProduct(res.data.product);
    } catch {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCartCount = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      const localCart: GuestCartItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const count = localCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const totalItems = res.data.cart.reduce(
        (acc: number, item: { quantity: number }) => acc + item.quantity,
        0
      );
      setCartCount(totalItems);
    } catch {
      console.error('Failed to fetch cart count');
    }
  };

  const addToCart = async (product: Product, quantity: number, imageUrl: string) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      const existing: GuestCartItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const index = existing.findIndex((item) => item.productId === product._id);
      if (index > -1) {
        existing[index].quantity = quantity;
      } else {
        existing.push({ productId: product._id, name: product.name, price: product.price, imageUrl, quantity });
      }
      localStorage.setItem('guestCart', JSON.stringify(existing));
      setCartCount(existing.reduce((acc, item) => acc + item.quantity, 0));
      return;
    }

    await axios.post(
      `http://localhost:3000/api/cart`,
      { productId: product._id, quantity, imageUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await fetchCartCount();
  };



  const value: AppContextType = {
    product,
    setProduct,
    error,
    setError,
    loading,
    setLoading,
    fetchProduct,
    quantity,
    setQuantity,
    isLoggedIn,
    login,
    logout,
    cartCount,
    setCartCount,
    fetchCartCount,
    addToCart,
    cartItems,
    setCartItems,
    showLogin,
    showSignUp,
    setShowLogin,
    setShowSignUp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
