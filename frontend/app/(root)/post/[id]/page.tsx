'use client';
import React, { useEffect, useState } from 'react';
import { IPost, IComment, IUser, IDecodedToken } from '@/interface';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import moment from 'moment';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const PostDetails = (props: any) => {
  const { params } = props;
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
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
  }, [post]);

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
  }, [user]);

  const placeholderAvatar = `https://avatar.iran.liara.run/public`;

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/post/${params.id}`
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post]);

  useEffect(() => {
    socket.on('newComment', (comment) => {
      setComments((prevComments) => [...prevComments, comment]);
    });

    return () => {
      socket.off('newComment');
    };
  }, []);

  const addComment = async () => {
    const comment = document.getElementById('comment') as HTMLTextAreaElement;
    if (!comment.value) return;

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment.value,
          postId: params.id,
          commenterId: user?._id,
        }),
      });

      const data = await response.json();
      setComments([...comments, data]);
      socket.emit('newComment', data);
      comment.value = '';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="w-full min-h-screen px-6 sm:px-12 md:px-24 lg:px-36 xl:px-48 py-16  text-white">
      {post && (
        <>
          {/* Cover Image */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src={post.coverImage || '/placeholder.jpg'}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Title and Author */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <img
                src={placeholderAvatar}
                alt={post.authorId.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
              />
              <div>
                <p className="text-lg font-medium text-blue-300">
                  {post.authorId.username}
                </p>
                <p className="text-gray-400 text-sm">
                  {moment(post.createdAt).format('HH:mm DD-MM-YYYY ')}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <article className="prose prose-invert lg:prose-lg xl:prose-xl text-gray-300 max-w-none leading-relaxed border-t border-gray-700 pt-8 mb-12">
            <p>{post.body}</p>
          </article>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-semibold text-blue-400 mb-6">
              Comments
            </h2>
            <div className="my-6">
              <textarea
                className="w-full p-4 bg-gray-800 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Write your comment here..."
                cols={30}
                rows={5}
                id="comment"
                name="comment"
              />
              <div className="flex flex-row justify-end">
                <button
                  className=" mt-4 bg-blue-400 text-gray-900 px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
                  onClick={addComment}
                >
                  Post Comment
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        comment.commenterId.profilePicture || placeholderAvatar
                      }
                      alt={comment.commenterId.username}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold text-blue-300">
                        {comment.commenterId.username}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {moment(comment.createdAt).format('HH:mm DD-MM-YYYY ')}
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
