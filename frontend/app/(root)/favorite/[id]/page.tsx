'use client';
import React, { useEffect, useState } from 'react';
import { IPost, IFavorite } from '@/interface';
import Link from 'next/link';
import Image from 'next/image';

const Favorite = (props: any) => {
  const { params } = props;

  const [listFavorite, setListFavorite] = useState<IFavorite[]>([]);

  const fetchFavorite = async () => {
    const response = await fetch(
      `http://localhost:5000/api/favorites/user/${params.id}`
    );
    const data = await response.json();
    setListFavorite(data);
  };

  useEffect(() => {
    fetchFavorite();
  }, [params.id]);

  const [listPost, setListPost] = useState<IPost[]>([]);

  const fetchPost = async () => {
    const postPromises = listFavorite.map(async (favorite: IFavorite) => {
      const response = await fetch(
        `http://localhost:5000/api/posts/${favorite.postId}`
      );
      return response.json();
    });

    const posts = await Promise.all(postPromises);
    setListPost(posts);
  };

  useEffect(() => {
    fetchPost();
  }, [listFavorite]);

  console.log(listPost);

  return (
    <div className="mx-20 m-5">
      <h1 className="text-5xl pt-4  font-semibold text-white py-4 filter drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow">
        Your Favorite Blogs
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-10 mb-8 ">
        {listPost.map((post) => (
          <div
            key={post._id}
            className="bg-gray-800 rounded-lg shadow-lg shadow-black/30 overflow-hidden transition-transform duration-300 hover:scale-105 group hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]"
          >
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
        ))}
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-24 left-0 w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
        <div className="absolute top-96 right-0 w-72 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
        <div className="absolute mt-[300px] top-96 left-0 w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
        <div className="absolute mt-[700px] top-96 right-0 w-72 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
        <div className="absolute mt-[1000px] top-96 left-0 w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
        <div className="absolute mt-[1400px] top-96 right-0 w-72 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default Favorite;
