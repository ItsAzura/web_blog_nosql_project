'use client';
import React, { useState, useEffect } from 'react';
import { IPost, ICategory } from '@/interface';
import Link from 'next/link';
import Image from 'next/image';
const PersonalWorkSpace = (props: any) => {
  const { params } = props;
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
  }, []);
  const [filter, setFilter] = useState({
    page: 1,
    title: '',
    category: '',
  });
  const [posts, setPosts] = useState<{
    totalPage: number;
    data: IPost[];
  }>({
    totalPage: 1,
    data: [],
  });
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const fetchPosts = async () => {
    try {
      const response = await fetch(`
            http://localhost:5000/api/posts/user/${
              params.id
            }?${new URLSearchParams({
        ...filter,
        page: filter.page.toString(),
      })}
            `);
      if (!response.ok) {
        setPosts({ totalPage: 1, data: [] });
      }
      const data = await response.json();
      setPosts({ totalPage: data.totalPage, data: data.posts });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams({
      ...filter,
      page: filter.page.toString(),
    });

    Object.keys(filter).forEach((key) => {
      const filterKey = key as keyof typeof filter;
      if (filter[filterKey]) {
        params.append(key, filter[filterKey].toString());
      }
    });
    fetchPosts();
  }, [categories, filter]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      setFilter((prevFilter) => ({
        ...prevFilter,
        [name]: value,
        page: 1,
      }));
    }, 500);
  };

  const handlePageChange = (page: number) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page,
    }));
  };

  const totalPages = posts.totalPage || 1;

  console.log(posts.data);

  return (
    <div className="mx-20 m-5">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-5xl pt-4  font-semibold text-white py-4 filter drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow">
          Your Work Space
        </h1>
        <Link href="/post/create">
          <button className="my-4 p-3 flex flex-row items-center gap-2 bg-[#0b1c37] text-white  rounded-lg hover:shadow-lg hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]">
            <span>Write Your Blog</span>
          </button>
        </Link>
      </div>
      <div className="w-[100%] grid grid-cols-4 gap-1 mb-10 mt-4">
        <input
          type="text"
          name="title"
          placeholder="Search by title"
          className="w-11/12 p-3 bg-[rgba(41,125,204,0.2)] text-white rounded focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-lg hover:shadow-[rgba(41,125,204,0.1)]"
          value={filter.title}
          onChange={handleFilterChange}
        />
        <select
          name="category"
          className="w-11/12 p-3 bg-[rgba(41,125,204,0.2)] text-white rounded focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-lg hover:shadow-[rgba(41,125,204,0.1)]"
          value={filter.category}
          onChange={handleFilterChange}
        >
          <option value="" className="bg-[#0b1c37] text-[#e7e7ea]">
            All Categories
          </option>
          {categories.map((category) => (
            <option
              key={category._id}
              value={category.name}
              className="bg-[#0b1c37] text-[#e7e7ea]"
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
        {posts && Array.isArray(posts.data) && posts.data.length > 0 ? (
          posts.data.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800 rounded-lg shadow-lg shadow-black/30 overflow-hidden transition-transform duration-300 hover:scale-105 group hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]"
            >
              {/* Image with overlay */}
              <div className="relative h-52">
                <Image
                  src={
                    post.coverImage
                      ? `http://localhost:5000${post.coverImage}`
                      : '/placeholder.jpg'
                  }
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={300}
                  height={200}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 group-hover:opacity-60 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{post.excerpt}</p>

                <div className="flex items-center justify-between text-gray-500 text-xs mb-6">
                  <span>By {post.authorId.username}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <Link href={`/post/${post._id}`}>
                  <button className="w-full py-2 px-4 rounded border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-colors duration-300">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
      <div className="mt-10 py-3 flex flex-row items-center justify-center space-x-4">
        <button
          className={`px-2 py-1 bg-[#297DCC] text-white rounded-lg transition-transform duration-300 ${
            filter.page === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#1d6eb1] hover:scale-105 hover:shadow-lg hover:shadow-[rgba(41,125,204,0.1)]'
          }`}
          onClick={() => handlePageChange(filter.page - 1)}
          disabled={filter.page === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2rem"
            height="2rem"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd">
              <path d="M24 0v24H0V0z" />
              <path
                fill="currentColor"
                d="M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122l-5.66-5.658Z"
              />
            </g>
          </svg>
        </button>

        <span className="text-white text-lg font-semibold">
          Page {filter.page} of {totalPages}
        </span>

        <button
          className={`px-2 py-1 bg-[#297DCC] text-white rounded-lg transition-transform duration-300 ${
            filter.page === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#1d6eb1] hover:scale-105 hover:shadow-lg hover:shadow-[rgba(41,125,204,0.1)]'
          }`}
          onClick={() => handlePageChange(filter.page + 1)}
          disabled={filter.page === totalPages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2rem"
            height="2rem"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd">
              <path d="M24 0v24H0V0z" />
              <path
                fill="currentColor"
                d="M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12 8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PersonalWorkSpace;
