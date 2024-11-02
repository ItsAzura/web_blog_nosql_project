'use client';
import React, { useState, useEffect } from 'react';
import { IPost, ICategory } from '@/interface';
import Link from 'next/link';
const PostList = () => {
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
            http://localhost:5000/api/posts?${new URLSearchParams({
              ...filter,
              page: filter.page.toString(),
            })}
            `);

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

  console.log(posts);

  return (
    <div className="mx-20 m-5">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-5xl pt-4  font-semibold text-white py-4 filter drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow">
          All Blog
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
              key={category.id}
              value={category.id}
              className="bg-[#0b1c37] text-[#e7e7ea]"
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-8 ">
        {posts && posts.data.length > 0 ? (
          posts.data.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800 rounded-lg shadow-lg shadow-black/30 overflow-hidden transition-transform duration-300 hover:scale-105 group hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]"
            >
              {/* Image with overlay */}
              <div className="relative h-52">
                <img
                  src={
                    `http://localhost:5000${post.coverImage}` ||
                    '/placeholder.jpg'
                  }
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          <div>No Post Found</div>
        )}
      </div>
    </div>
  );
};

export default PostList;
