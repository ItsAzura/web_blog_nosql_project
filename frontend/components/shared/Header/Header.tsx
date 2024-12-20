'use client';
import React, { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { IDecodedToken, IUser } from '@/interface';
import logo from '../../../public/logo.png';

const Header: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const token = Cookies.get('blog_token');

    if (token) {
      const decodedToken: IDecodedToken = jwtDecode<IDecodedToken>(token);

      const fetchUserInfo = async () => {
        try {
          const response = await axios.get<IUser>(
            `http://localhost:5000/api/users/profile/${decodedToken.userId}`
          );

          setUser(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchUserInfo();
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post<{ message: string }>(
        'http://localhost:5000/api/users/logout'
      );

      if (response.data.message === 'User logged out successfully') {
        Cookies.remove('blog_token');
        setUser(null);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="mx-20 my-4 p-4 bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          <Image src={logo} alt="Logo" width={90} height={40} />
        </Link>

        <nav className="text-xl hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors duration-200 hover:drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]"
          >
            Home Page
          </Link>
          <Link
            href="/contact"
            className="text-gray-300 hover:text-white transition-colors duration-200 hover:drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]"
          >
            Contact
          </Link>
          <Link
            href="/aboutus"
            className="text-gray-300 hover:text-white transition-colors duration-200 hover:drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]"
          >
            About Us
          </Link>
          <Link
            href="/post"
            className="text-gray-300 hover:text-white transition-colors duration-200 hover:drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]"
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center space-x-6">
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <div className="hidden md:flex space-x-4">
              <button
                onClick={handleLogin}
                className="text-gray-300 hover:text-white transition-colors duration-200 hover:drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]"
              >
                Login
              </button>
              <Link
                href="/signup"
                className="text-white bg-[#007BFF] px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#007BFF] transition-all duration-300 shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden flex items-center text-gray-300 hover:text-white transition-colors duration-200">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
