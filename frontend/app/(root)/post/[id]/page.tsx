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
import Image from 'next/image';

const socket = io('http://localhost:5000');

const PostDetails = (props: any) => {
  const { params } = props;
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');

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
  }, [params.id]);

  useEffect(() => {
    socket.on('newComment', (comment) => {
      setComments((prevComments) => {
        if (!prevComments.find((c) => c._id === comment._id)) {
          return [...prevComments, comment];
        }
        return prevComments;
      });
    });

    socket.on('updateComment', (updatedComment) => {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
    });

    socket.on('deleteComment', (commentId) => {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    });

    return () => {
      socket.off('newComment');
      socket.off('updateComment');
      socket.off('deleteComment');
    };
  }, []);

  const addComment = async () => {
    const comment = document.getElementById('comment') as HTMLTextAreaElement;
    if (!comment.value) return;

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleEditClick = (comment: IComment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.comment);
  };

  const saveEditedComment = async (commentId: string) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { comment: editingCommentText }
      );

      if (response.status === 200) {
        const updatedComment = {
          ...response.data,
          comment: editingCommentText,
        };
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId ? updatedComment : comment
          )
        );
        socket.emit('updateComment', updatedComment);
        setEditingCommentId(null);
        toast.success('Comment updated successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update comment.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/comments/${commentId}`
      );
      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
        socket.emit('deleteComment', commentId);
        toast.success('Comment deleted successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete comment.');
    }
  };

  const handleConfirmDeleteComment = () => {
    if (deletingCommentId) {
      handleDeleteComment(deletingCommentId);
      setDeletingCommentId(null);
    }
    setIsModalOpen(false);
  };

  const placeholderAvatar = 'https://avatar.iran.liara.run/public';

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
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
            <Image
              src={
                post.coverImage
                  ? `http://localhost:5000${post.coverImage}`
                  : '/placeholder.jpg'
              }
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
              width={1200}
              height={500}
            />
          </div>

          {/* Title and Author */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-blue-500 ">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <img
                src={`https://ui-avatars.com/api/?name=${post.authorId.username}&background=random&color=fff`}
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
                        comment.commenterId.profilePicture ||
                        `https://ui-avatars.com/api/?name=${comment.commenterId.username}&background=random&color=fff`
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

                  {/* Render either textarea for editing or normal comment text */}
                  {editingCommentId === comment._id ? (
                    <div>
                      <textarea
                        className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          className="bg-blue-400 text-gray-900 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
                          onClick={() => saveEditedComment(comment._id)}
                        >
                          Save
                        </button>
                        <button
                          className="ml-2 text-red-400"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300">{comment.comment}</p>
                  )}

                  {/* Show edit button only for the user who created the comment */}
                  {user?._id === comment.commenterId._id && (
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className="bg-blue-400 text-white px-2 py-1 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
                        onClick={() => handleEditClick(comment)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5rem"
                          height="1.5rem"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"
                          />
                        </svg>
                      </button>
                      <button
                        className="bg-red-400 text-white px-2 py-1 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
                        onClick={() => {
                          setDeletingCommentId(comment._id);
                          setIsModalOpen(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5rem"
                          height="1.5rem"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M20 8.7H4a.75.75 0 1 1 0-1.5h16a.75.75 0 0 1 0 1.5"
                          />
                          <path
                            fill="currentColor"
                            d="M16.44 20.75H7.56A2.4 2.4 0 0 1 5 18.49V8a.75.75 0 0 1 1.5 0v10.49c0 .41.47.76 1 .76h8.88c.56 0 1-.35 1-.76V8A.75.75 0 1 1 19 8v10.49a2.4 2.4 0 0 1-2.56 2.26m.12-13a.74.74 0 0 1-.75-.75V5.51c0-.41-.48-.76-1-.76H9.22c-.55 0-1 .35-1 .76V7a.75.75 0 1 1-1.5 0V5.51a2.41 2.41 0 0 1 2.5-2.26h5.56a2.41 2.41 0 0 1 2.53 2.26V7a.75.75 0 0 1-.75.76Z"
                          />
                          <path
                            fill="currentColor"
                            d="M10.22 17a.76.76 0 0 1-.75-.75v-4.53a.75.75 0 0 1 1.5 0v4.52a.75.75 0 0 1-.75.76m3.56 0a.75.75 0 0 1-.75-.75v-4.53a.75.75 0 0 1 1.5 0v4.52a.76.76 0 0 1-.75.76"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this comment?"
        onConfirm={handleConfirmDeleteComment}
        onCancel={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default PostDetails;
