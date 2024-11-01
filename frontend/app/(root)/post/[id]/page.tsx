'use client';
import React, { useEffect, useState } from 'react';
import { IPost } from '@/interface';

const PostDetails = (props: any) => {
  const { params } = props;
  const [post, setPost] = useState<IPost | null>(null);

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${params.id}`
      );
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const placeholderAvatar = `https://avatar.iran.liara.run/public`;

  // Mock data for comments
  const comments = [
    {
      id: 1,
      username: 'user1',
      avatar: placeholderAvatar,
      comment: 'Great post! Very informative.',
      date: '2024-10-28',
    },
    {
      id: 2,
      username: 'user2',
      avatar: placeholderAvatar,
      comment: 'Thanks for sharing!',
      date: '2024-10-29',
    },
  ];

  return (
    <section className="w-full min-h-screen px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-12  text-white">
      {post && (
        <>
          {/* Cover Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.coverImage || '/placeholder.jpg'}
              alt={post.title}
              className="w-full h-80 object-cover rounded-lg transition-transform duration-500 hover:scale-105 shadow-md"
            />
          </div>

          {/* Title and Author */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight text-blue-400">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <img
                src={placeholderAvatar}
                alt={post.authorId.username}
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border-2 border-blue-400"
              />
              <div>
                <p className="text-base sm:text-lg font-medium">
                  {post.authorId.username}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <article className="prose prose-invert lg:prose-lg xl:prose-xl text-gray-300 max-w-none leading-relaxed border-t border-gray-700 pt-8">
            <p>{post.body}</p>
          </article>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Comments</h2>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-3">
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">{comment.username}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {new Date(comment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300">{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default PostDetails;
