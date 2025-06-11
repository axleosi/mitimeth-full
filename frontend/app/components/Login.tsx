'use client'
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAppContext } from '../context/appContext';

interface LoginProps {
  closeForm: () => void;
  switchToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ closeForm, switchToSignUp }) => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAppContext();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setError(null);
      try {
        const res = await axios.post(`http://localhost:3000/api/user/login`, values);
        const token = res.data.token;
        login(token);
        localStorage.setItem('authToken', token);
        closeForm();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const backendMessage = err.response?.data?.error || 'Login failed. Ensure correct email and password.';
          setError(backendMessage);
        } else {
          setError('An unexpected error occurred');
        }
      }
    },
  });

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 px-4 pt-20 sm:pt-32">
      <div className="relative bg-white p-2 rounded-lg shadow-lg w-full md:w-[80%]">
        {/* Close Button */}
        <button
          onClick={closeForm}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="border border-gray-300 p-2 w-full rounded mt-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="border border-gray-300 p-2 w-full rounded mt-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-purple-300 text-white py-2 rounded hover:bg-purple-500 transition"
          >
            Login
          </button>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Switch to Signup */}
          <p className="text-sm text-center mt-2">
            Don&apos;t have an account?{' '}
            <button onClick={switchToSignUp} className="text-purple-300 hover:underline">
              Sign up here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;