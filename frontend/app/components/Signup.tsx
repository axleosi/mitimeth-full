'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

interface SignUpProps {
  closeForm: () => void;
  switchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ closeForm, switchToLogin }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      setErrorMessage("");
      try {
        const response = await axios.post(`${apiUrl}/api/user/signup`, values);
        localStorage.setItem('authToken', response.data.token);
        closeForm();
      } catch (err: unknown) {
        let backendError = "Signup failed";
        if (axios.isAxiosError(err)) {
          backendError = err.response?.data?.error || err.message;
        } else if (err instanceof Error) {
          backendError = err.message;
        }
        console.error("Signup error:", backendError);
        setErrorMessage(backendError);
      }
    },
  });

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 px-4 pt-20 sm:pt-32">
      <div className="relative bg-white p-2 rounded-lg shadow-lg w-full md:w-[80%]">
        <button onClick={closeForm} className="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>


        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Name and Email */}
          <div className="md:flex sm:gap-4">
            <div className="md:w-1/2">
              <label htmlFor="name" className="block text-sm">Name</label>
              <input
                id="name" name="name" type="text"
                className="border border-gray-300 p-2 w-full rounded mt-1"
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values.name} placeholder="Type your name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              )}
            </div>

            <div className="md:w-1/2 mt-4 sm:mt-0">
              <label htmlFor="email" className="block text-sm">Email</label>
              <input
                id="email" name="email" type="email"
                className="border border-gray-300 p-2 w-full rounded mt-1"
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values.email} placeholder="you@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>
          </div>

          {/* Password and Confirm Password */}
          <div className="md:flex sm:gap-4">
            <div className="md:w-1/2 relative">
              <label htmlFor="password" className="block text-sm">Password</label>
              <input
                id="password" name="password" type={showPassword ? "text" : "password"}
                className="border border-gray-300 p-2 w-full rounded mt-1 pr-10"
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values.password} placeholder="••••••••"
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute top-8 right-2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}
            </div>

            <div className="md:w-1/2 relative mt-4 sm:mt-0">
              <label htmlFor="confirmPassword" className="block text-sm">Confirm Password</label>
              <input
                id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                className="border border-gray-300 p-2 w-full rounded mt-1 pr-10"
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values.confirmPassword} placeholder="••••••••"
              />
              <button
                type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-8 right-2 text-sm text-gray-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <button type="submit" className="bg-purple-300 text-white py-2 rounded hover:bg-purple-500 transition">
            Sign Up
          </button>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}

          <p className="text-sm text-center mt-2">
            Already have an account?{' '}
            <button onClick={switchToLogin} className="text-purple-300 hover:underline">
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
