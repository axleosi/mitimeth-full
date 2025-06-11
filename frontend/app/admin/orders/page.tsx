'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Product = {
  _id: string;
  name: string;
};

type OrderItem = {
  product: Product;
  quantity: number;
  priceAtOrderTime?: number;
  nameAtOrderTime?: string;
};

type Order = {
  _id: string;
  user: { _id: string; name: string };
  items: OrderItem[];
  address: string;
  phoneNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://localhost:3000/api/order/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch orders');
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map(order => (
            <li key={order._id} className="border p-4 rounded shadow">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>User:</strong> {order.user.name}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Phone:</strong> {order.phoneNumber}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
              </p>

              <div className="mt-3">
                <strong>Items:</strong>
                <ul className="list-disc ml-6 mt-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.product?.name || item.nameAtOrderTime} — Quantity: {item.quantity} — Price: $
                      {(item.priceAtOrderTime ?? 0).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
