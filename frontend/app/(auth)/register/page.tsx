'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmpassword) {
      toast.error('Please fill all the fields');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (password !== confirmpassword) {
      toast.error('Passwords do not match');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const data = { username, email, password };

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error('Something went wrong');
        return;
      }

      toast.success('User created successfully');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-4 py-10 md:px-20">
      <ToastContainer />

      {/* Text and Form Section */}
      <motion.div
        className="flex-1 text-center md:text-left md:ml-[6%]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white filter drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow mb-6 md:mb-10">
          Create a new account
        </h1>

        {/* Form */}
        <motion.form
          className="mt-4 md:mt-6 w-full max-w-xs md:max-w-sm mx-auto md:mx-0"
          onSubmit={handleSubmit}
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <div className="flex flex-col mb-4">
            <label htmlFor="username" className="mb-2 font-semibold text-white">
              UserName
            </label>
            <motion.input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="User Name"
              className="py-3 px-5 border-gray-300 rounded bg-[rgba(41,125,204,0.2)] text-white focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-md transition-shadow duration-200"
              whileFocus={{ scale: 1.05 }}
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-2 font-semibold text-white">
              Email
            </label>
            <motion.input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="py-3 px-5 border-gray-300 rounded bg-[rgba(41,125,204,0.2)] text-white focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-md transition-shadow duration-200"
              whileFocus={{ scale: 1.05 }}
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="mb-2 font-semibold text-white">
              Password
            </label>
            <motion.input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="py-3 px-5 border-gray-300 rounded bg-[rgba(41,125,204,0.2)] text-white focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-md transition-shadow duration-200"
              whileFocus={{ scale: 1.05 }}
            />
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="confirmpassword"
              className="mb-2 font-semibold text-white"
            >
              Confirm Password
            </label>
            <motion.input
              type="password"
              id="confirmpassword"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="py-3 px-5 border-gray-300 rounded bg-[rgba(41,125,204,0.2)] text-white focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-md transition-shadow duration-200"
              whileFocus={{ scale: 1.05 }}
            />
          </div>

          <motion.button
            type="submit"
            className="py-3 w-full text-lg md:text-xl font-semibold bg-blue-500 text-white rounded-md mt-8 hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
          >
            Register
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <p className="mt-6 text-white">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-300 hover:text-blue-500 transition-colors duration-200"
            >
              Login
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
          src={'/sign-in.png'}
          alt="Login"
          width={600}
          height={600}
          className="md:ml-10 max-w-full h-auto md:max-w-lg hidden md:block"
        />
      </motion.div>
    </div>
  );
};

export default SignUp;
