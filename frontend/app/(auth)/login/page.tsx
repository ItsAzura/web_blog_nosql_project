'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import signin from '../../../public/sign-in.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Làm ơn nhập đầy đủ thông tin');
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake after 500ms
      return;
    }

    const data = { email, password };

    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error('Lỗi đăng nhập');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      const result = await res.json();
      toast.success('Đăng nhập thành công');

      setEmail('');
      setPassword('');

      document.cookie = `blog_token=${result.token}`;

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi đăng nhập');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-4 py-10 md:px-20">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <div className="flex flex-col md:flex-row items-center justify-center w-full">
        {/* Text and Form Section */}
        <motion.div
          className="flex-1 text-center md:text-left md:ml-[6%]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white filter drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow mb-6 md:mb-10">
            Welcome Back
          </h1>

          {/* Form */}
          <motion.form
            className="mt-4 md:mt-6 w-full max-w-xs md:max-w-sm mx-auto md:mx-0"
            onSubmit={handleSubmit}
            animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="mb-2 font-semibold text-white">
                Email
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="py-3 px-5 border-gray-300 rounded bg-[rgba(41,125,204,0.2)] text-white focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-md transition-shadow duration-200"
                whileFocus={{ scale: 1.05 }}
              />
            </div>

            <div className="flex flex-col mb-4">
              <label
                htmlFor="password"
                className="mb-2 font-semibold text-white"
              >
                Password
              </label>
              <motion.input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="py-3 px-5 border-gray-300 rounded bg-[rgba(41,125,204,0.2)] text-white focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-md transition-shadow duration-200"
                whileFocus={{ scale: 1.05 }}
              />
            </div>

            <motion.button
              type="submit"
              className="py-3 w-full text-lg md:text-xl font-semibold bg-blue-500 text-white rounded-md mt-8 hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              Login
            </motion.button>
          </motion.form>

          {/* Link to Register */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <p className="mt-6 text-white">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-blue-300 hover:text-blue-500 transition-colors duration-200"
              >
                Register
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="flex-1 mt-8 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={signin}
            alt="Login"
            width={600}
            height={600}
            priority
            className="md:ml-10 max-w-full h-auto md:max-w-lg hidden md:block rounded-lg"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
