import React from 'react';
import { IPost } from '../../interface';
import Link from 'next/link';

interface FeaturedPostsProps {
  posts: IPost[];
}

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({ posts }) => {
  return (
    <section className="text-white py-12 px-8 md:px-16 lg:px-24">
      <h2 className="text-4xl font-semibold text-center mb-12 text-white tracking-tight uppercase drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow">
        Featured Posts
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-800 rounded-lg shadow-lg shadow-black/30 overflow-hidden transition-transform duration-300 hover:scale-105 group hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]"
          >
            {/* Image with overlay */}
            <div className="relative h-52">
              <img
                src={
                  post.coverImage
                    ? `http://localhost:5000${post.coverImage}`
                    : '/placeholder.jpg'
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
        ))}
      </div>

      {/* View More button */}
      <div className="flex justify-end">
        <Link href={`/post`}>
          <button className="py-2 px-6 rounded border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-colors duration-300">
            View More
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedPosts;
