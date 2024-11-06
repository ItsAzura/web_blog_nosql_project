'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {} from '../../interface';
import FeaturedPosts from '@/components/Home/FeaturedPosts';
import LatestPosts from '@/components/Home/LatestPosts';
import Testimonials from '@/components/Home/Testimonials';
import CategoryList from '@/components/Home/CategoryList';
import { IDecodedToken, IPost, IUser, ICategory } from '@/interface';

const mockCategories = [
  { _id: '1', name: 'Technology', postCount: 12 },
  { _id: '2', name: 'Design', postCount: 8 },
  { _id: '3', name: 'Health', postCount: 15 },
  { _id: '4', name: 'Lifestyle', postCount: 7 },
  { _id: '5', name: 'Travel', postCount: 5 },
  { _id: '6', name: 'A.I', postCount: 10 },
];

const mockTestimonials = [
  {
    id: '1',
    name: 'Tu Pham',
    role: 'Reader',
    message:
      "This blog has completely changed the way I think about my daily life. It's insightful and very relatable!",
  },
  {
    id: '2',
    name: 'Tho Tran',
    role: 'Frequent Visitor',
    message:
      'I love the variety of topics covered here. The articles are well-researched and engaging.',
  },
  {
    id: '3',
    name: 'Quang Tran',
    role: 'Blogger',
    message:
      'As a fellow blogger, I appreciate the quality of content shared on this platform. Keep up the great work!',
  },
];

export default function Home() {
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

  const [categories, setCategories] = useState<ICategory[]>([]);
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const [likedPosts, setLikedPosts] = useState<IPost[]>([]);
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts/top-liked');
      const data = await response.json();
      setLikedPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [latestPosts, setLatestPosts] = useState<IPost[]>([]);
  const fetchLatestPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts/latest');
      const data = await response.json();
      setLatestPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchLatestPosts();
  }, [categories]);

  return (
    <>
      <section className="py-14 ml-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-24 left-0 w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
          <div className="absolute top-96 right-0 w-72 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
          <div className="absolute mt-[300px] top-96 left-0 w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
          <div className="absolute mt-[700px] top-96 right-0 w-72 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
          <div className="absolute mt-[1000px] top-96 left-0 w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
          <div className="absolute mt-[1400px] top-96 right-0 w-72 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
          <div className="absolute mt-[1600px] top-96 left-0 w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
          <div className="absolute mt-[2000px] top-96 right-0 w-72 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
          <div className="absolute mt-[2200px] top-96 left-0 w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
          <div className="absolute mt-[2600px] top-96 right-0 w-72 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
        </div>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-10">
          {/* Left - Text Section */}
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            {user && (
              <p className="text-xl text-gray-200 dark:text-white mb-4">
                Welcome back, {user.username}!
              </p>
            )}
            <h1 className="text-3xl md:text-7xl font-bold text-gray-800 dark:text-white leading-tight mb-4 drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow">
              Welcome to Azura's Blog
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-300 text-lg">
              This is a simple blog application where you can create, read,
              update, and delete blogs.
            </p>
            <button className="mt-6 bg-blue-500 text-white font-semibold px-6 py-3 rounded-md  transition duration-300 hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]">
              Enjoy your stay!
            </button>
          </div>

          {/* Right - Image Section */}
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/hero.png"
              alt="Illustration of people reading and writing blogs"
              width={500}
              height={500}
              className="w-full max-w-sm md:max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <FeaturedPosts posts={likedPosts} />

      <CategoryList categories={categories} />

      <LatestPosts posts={latestPosts} />

      <Testimonials testimonials={mockTestimonials} />
    </>
  );
}
