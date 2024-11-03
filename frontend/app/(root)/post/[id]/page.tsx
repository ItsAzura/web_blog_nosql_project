'use client';
import React, { useEffect, useState } from 'react';
import { IPost, IComment, IUser, IDecodedToken } from '@/interface';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import moment from 'moment';
import { io } from 'socket.io-client';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from '@/components/shared/ConfirmModal';

const socket = io('http://localhost:5000');

const PostDetails = (props: any) => {
  const { params } = props;
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/posts/${params.id}`
        );
        const postData = await response.json();
        setPost(postData);

        const commentsResponse = await fetch(
          `http://localhost:5000/api/comments/post/${params.id}`
        );
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostAndComments();
  }, [params.id]); // Chỉ chạy khi `params.id` thay đổi

  const placeholderAvatar = `https://avatar.iran.liara.run/public`;

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

  const handleDelete = async () => {
    try {
      const response = await axios.delete<{ message: string }>(
        `http://localhost:5000/api/posts/${post?._id}`
      );

      if (response.status === 200) {
        toast.success('Post deleted successfully');
        setTimeout(() => {
          window.location.href = '/post';
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="w-full min-h-screen px-6 sm:px-12 md:px-24 lg:px-36 xl:px-48 py-16  text-white">
      <ToastContainer />
      {user?._id === post?.authorId._id && (
        <div className="mb-8 flex flex-row gap-2">
          <Link href={`/post/edit/${post?._id}`}>
            <button className="text-white flex flex-row justify-center items-center bg-blue-400  px-2 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2rem"
                height="2rem"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  strokeWidth="1.5"
                  d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"
                />
              </svg>
              <span>Edit Post</span>
            </button>
          </Link>

          <button
            className="text-white flex flex-row justify-center items-center bg-red-400  px-2 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2rem"
              height="2rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
              />
            </svg>
            <span>Delete Post</span>
          </button>
        </div>
      )}
      {post && (
        <>
          {/* Cover Image */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src={
                post.coverImage
                  ? `http://localhost:5000${post.coverImage}`
                  : '/placeholder.jpg'
              }
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Title and Author */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-blue-500 ">
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
            <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
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
      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this blog?"
        onConfirm={() => {
          handleDelete();
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default PostDetails;
