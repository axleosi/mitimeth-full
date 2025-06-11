'use client'
import React, { useState } from "react";
import axios from "axios"; // Import AxiosError type

const AdminLogin = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/admin/login`, {
        email,
        password,
      });

      // If successful, store the token in localStorage or a cookie
      localStorage.setItem("authToken", response.data.token);
      alert("Login successful!");

      window.location.href = "/admin/dashboard"; 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message || "Login failed");
      } else {
        setErrorMessage("An error occurred");
      }
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 py-6 px-2">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
        <p className="text-sm text-center mb-6 text-gray-600">
          Log in to access the admin dashboard.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="border border-gray-300 p-2 w-full rounded mt-1"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="border border-gray-300 p-2 w-full rounded mt-1"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-pink-300 text-white py-2 rounded hover:bg-pink-500 transition"
          >
            Login
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm text-center mt-2">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
