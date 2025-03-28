'use client';
import React, { useEffect, useState } from 'react';
import { IPost, ICategory } from '@/interface';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import router from 'next/router';

const EditPost = (props: any) => {
  const { params } = props;
  const [post, setPost] = useState<IPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const fetchPost = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${params.id}`
      );
      const postData = await response.json();
      setPost(postData);
      console.log(postData);
    } catch (error) {
      console.error(error);
    }
  };

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
    fetchPost();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.body);
      setCategory(post.categoryId.name);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', content);
    formData.append('categoryName', category);
    if (coverImage) {
      formData.append('coverImage', coverImage as Blob);
    }
    if (post?.authorId._id) {
      formData.append('authorId', post.authorId._id);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${params.id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        toast.error(`Cập nhật bài viết thất bại: ${errorData.message}`);
      } else {
        toast.success('Cập nhật bài viết thành công');
        setTimeout(() => {
          window.location.href = `/post/${params.id}`;
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật bài viết');
    }
  };
  return (
    <div className="mx-20 m-5">
      <ToastContainer />
      <h1 className="text-5xl pt-4 font-semibold text-white py-4 filter drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow">
        Update Your Blog
      </h1>
      <form className="w-[60%]" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-2 mb-4">
          <label className="text-white mb-1">Title</label>
          <input
            type="text"
            className="p-3 bg-[rgba(41,125,204,0.2)] text-white rounded focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-lg hover:shadow-[rgba(41,125,204,0.1)] transition duration-300 ease-in-out"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 mb-24">
          <label className="text-white mb-1">Body</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
                ['clean'],
                ['code-block'],
                [
                  {
                    color: [
                      '#000000',
                      '#e60000',
                      '#ff9900',
                      '#ffff00',
                      '#008a00',
                      '#0066cc',
                      '#9933ff',
                      '#ffffff',
                      '#facccc',
                      '#ffebcc',
                      '#ffffcc',
                      '#cce8cc',
                      '#cce0f5',
                      '#ebd6ff',
                      '#bbbbbb',
                      '#f06666',
                      '#ffc266',
                      '#ffff66',
                      '#66b966',
                      '#66a3e0',
                      '#c285ff',
                      '#888888',
                      '#a10000',
                      '#b26b00',
                      '#b2b200',
                      '#006100',
                      '#0047b2',
                      '#6b24b2',
                      '#444444',
                      '#5c0000',
                      '#663d00',
                      '#666600',
                      '#003700',
                      '#002966',
                      '#3d1466',
                      'custom-color',
                    ],
                  },
                  { background: [] },
                ],
              ],
            }}
            className="text-white bg-[rgba(41,125,204,0.15)] focus:outline-none focus:ring-4 focus:ring-blue-500/40 hover:shadow-[rgba(41,125,204,0.2)] transition-all duration-300 ease-in-out"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4">
          <label className="text-white mb-1">Cover Image</label>

          {/* Icon để chọn ảnh */}
          <div
            className="flex items-center justify-center w-16 h-16 bg-[rgba(41,125,204,0.2)] text-white rounded-full cursor-pointer hover:bg-[rgba(41,125,204,0.4)] transition duration-300"
            onClick={() => document.getElementById('coverImageInput')?.click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2rem"
              height="2rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"
              />
            </svg>
          </div>

          {/* Input file ẩn */}
          <input
            type="file"
            id="coverImageInput"
            accept="image/*"
            onChange={(e) =>
              setCoverImage(e.target.files ? e.target.files[0] : null)
            }
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4">
          <label className="text-white mb-1">Category</label>
          <select
            className="p-3 bg-[rgba(41,125,204,0.2)] text-white rounded focus:outline-none focus:ring-2 focus:ring-[rgba(41,125,204,0.5)] hover:shadow-lg hover:shadow-[rgba(41,125,204,0.1)] transition duration-300 ease-in-out"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" className="bg-[#0b1c37] text-[#e7e7ea]">
              Select category
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
        <button
          type="submit"
          className="bg-blue-500 w-36 p-3 text-white rounded transition-colors duration-300 ease-in-out"
        >
          Update Blog
        </button>
        <button
          className="my-4 flex flex-row items-center gap-2 bg-[#0b1c37] text-white p-2 border border-[rgba(41,125,204,0.5)] rounded-lg hover:shadow-lg hover:shadow-[rgba(41,125,204,0.1)]"
          onClick={() => router.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2rem"
            height="2rem"
            viewBox="0 0 32 32"
          >
            <path
              fill="currentColor"
              d="M22 8v2c2.206 0 4 1.794 4 4s-1.794 4-4 4H10v-5l-6 6l6 6v-5h12c3.309 0 6-2.691 6-6s-2.691-6-6-6"
            />
          </svg>
          <span>Back</span>
        </button>
      </form>
    </div>
  );
};

export default EditPost;
