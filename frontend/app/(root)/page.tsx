'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { IDecodedToken, IPost, IUser, ICategory } from '@/interface';
import FeaturedPosts from '@/components/Home/FeaturedPosts';
import LatestPosts from '@/components/Home/LatestPosts';
import Testimonials from '@/components/Home/Testimonials';
import CategoryList from '@/components/Home/CategoryList';
import hero from '../../public/hero.png';

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
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [likedPosts, setLikedPosts] = useState<IPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('blog_token');
        if (token) {
          const decodedToken: IDecodedToken = jwtDecode<IDecodedToken>(token);
          const userResponse = await axios.get<IUser>(
            `http://localhost:5000/api/users/profile/${decodedToken.userId}`
          );
          setUser(userResponse.data);
        }

        const categoriesResponse = await fetch(
          'http://localhost:5000/api/categories'
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const likedResponse = await fetch(
          'http://localhost:5000/api/posts/top-liked'
        );
        const likedData = await likedResponse.json();
        setLikedPosts(likedData);

        const latestResponse = await fetch(
          'http://localhost:5000/api/posts/latest'
        );
        const latestData = await latestResponse.json();
        setLatestPosts(latestData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <section className="py-14 ml-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-10">
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
            <button className="mt-6 bg-blue-500 text-white font-semibold px-6 py-3 rounded-md transition duration-300 hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]">
              Enjoy your stay!
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <Image
              src={hero}
              alt="Illustration of people reading and writing blogs"
              width={500}
              height={500}
              priority
              className="w-full max-w-sm md:max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {likedPosts.length > 0 && <FeaturedPosts posts={likedPosts} />}
      {categories.length > 0 && <CategoryList categories={categories} />}
      {latestPosts.length > 0 && <LatestPosts posts={latestPosts} />}
      <Testimonials testimonials={mockTestimonials} />
    </main>
  );
}
