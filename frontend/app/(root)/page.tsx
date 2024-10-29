'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Post } from '../../interface';
import FeaturedPosts from '@/components/Home/FeaturedPosts';
import LatestPosts from '@/components/Home/LatestPosts';
import Testimonials from '@/components/Home/Testimonials';

interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Exploring the Future of AI',
    excerpt:
      'Dive into the advancements in AI and what it holds for the future.',
    imageUrl: '/ai-future.jpg',
    author: 'John Doe',
    date: '2024-10-25',
  },
  {
    id: '2',
    title: 'The Importance of Mental Health',
    excerpt:
      'Mental health is essential for overall well-being. Learn more here.',
    imageUrl: '/mental-health.jpg',
    author: 'Jane Smith',
    date: '2024-10-20',
  },
  {
    id: '3',
    title: 'Achieving Work-Life Balance',
    excerpt: 'Tips on how to maintain a healthy work-life balance.',
    imageUrl: 'work-life.jpg',
    author: 'Mary Johnson',
    date: '2024-10-18',
  },
  {
    id: '4',
    title: 'A Guide to Financial Independence',
    excerpt: 'Take control of your finances and achieve independence.',
    imageUrl: 'finance.jpg',
    author: 'Chris Lee',
    date: '2024-10-15',
  },
  {
    id: '5',
    title: 'Sustainable Living Tips',
    excerpt: 'Discover ways to live a sustainable life for a greener future.',
    imageUrl: '/sustainability.jpg',
    author: 'Pat Brown',
    date: '2024-10-12',
  },
];

const mockTestimonials = [
  {
    id: '1',
    name: 'Emma Watson',
    role: 'Reader',
    message:
      "This blog has completely changed the way I think about my daily life. It's insightful and very relatable!",
  },
  {
    id: '2',
    name: 'Liam Neeson',
    role: 'Frequent Visitor',
    message:
      'I love the variety of topics covered here. The articles are well-researched and engaging.',
  },
  {
    id: '3',
    name: 'Sophia Turner',
    role: 'Blogger',
    message:
      'As a fellow blogger, I appreciate the quality of content shared on this platform. Keep up the great work!',
  },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get('blog_token');

    if (token) {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);

      const fetchUserInfo = async () => {
        try {
          const response = await axios.get<User>(
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

  return (
    <>
      <section className="py-14 ml-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-10">
          {/* Left - Text Section */}
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            {user && (
              <p className="text-xl text-gray-200 dark:text-white mb-4">
                Welcome back, {user.username}!
              </p>
            )}
            <h1 className="text-3xl md:text-7xl font-bold text-gray-800 dark:text-white leading-tight mb-4">
              Welcome to Azura's Blog
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-300 text-lg">
              This is a simple blog application where you can create, read,
              update, and delete blogs.
            </p>
            <button className="mt-6 bg-indigo-500 text-white px-6 py-3 rounded-md hover:bg-indigo-600 transition duration-300">
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

      <FeaturedPosts posts={mockPosts} />

      <LatestPosts posts={mockPosts} />

      <Testimonials testimonials={mockTestimonials} />
    </>
  );
}
