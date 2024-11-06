'use client';
import React, { useEffect, useState } from 'react';
import { IUser } from '@/interface';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProfile = (props: any) => {
  const { params } = props;
  const [user, setUser] = useState<IUser | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/profile/${params.id}`
      );
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPassword(user.password);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('username', username);
    formData.append('email', email);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    try {
      const response = await fetch(
        `
            http://localhost:5000/api/users/profile/${params.id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        toast.error('Failed to update profile');
      } else {
        toast.success('Profile updated successfully');
        setTimeout(() => {
          window.location.href = `/profile/${params.id}`;
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update post');
    }
  };
  return (
    <div className="mx-20 m-5">
      <ToastContainer />
      <h1 className="text-5xl pt-4 font-semibold text-white py-4 filter drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow">
        Update Your Profile
      </h1>
      <form className="w-[60%]" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-2 mb-4">
          <label className="text-white mb-1">Username</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 mb-4">
          <label className="text-white mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly
          />
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4">
          <label className="text-white mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4">
          <label className="text-white mb-1">Profile Picture</label>
          <div
            className="flex items-center justify-center w-16 h-16 bg-[rgba(41,125,204,0.2)] text-white rounded-full cursor-pointer hover:bg-[rgba(41,125,204,0.4)] transition duration-300"
            onClick={() =>
              document.getElementById('profilePictureInput')?.click()
            }
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
          <input
            type="file"
            id="profilePictureInput"
            accept="image/*"
            onChange={(e) =>
              setProfilePicture(e.target.files ? e.target.files[0] : null)
            }
            className="hidden"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 w-36 p-3 text-white rounded transition-colors duration-300 ease-in-out"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
