'use client';
import React, { useEffect, useState } from 'react';
import { IUser } from '@/interface';
import Link from 'next/link';

const ProfileDetails = (props: any) => {
  const { params } = props;
  const [user, setUser] = useState<IUser | null>(null);

  const fetchProfile = async () => {
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
    fetchProfile();
  }, [params.id]);

  return (
    <section className="w-full max-w-2xl mx-auto p-8 bg-gray-800 text-white rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-2xl">
      {user && (
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={
                user.profilePicture
                  ? `http://localhost:5000${user.profilePicture}`
                  : `https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`
              }
              alt={user.username}
              className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-md transform hover:scale-105 transition-transform duration-200"
            />
            <span className="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2rem"
                height="2rem"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="6" r="4" fill="currentColor" />
                <path
                  fill="currentColor"
                  d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
                />
              </svg>
            </span>
          </div>

          {/* Username */}
          <h1 className="text-4xl font-bold text-blue-400">{user.username}</h1>

          {/* User Information */}
          <div className="flex flex-col items-center space-y-2">
            {/* Role */}
            <p className="flex items-center text-lg font-medium text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2rem"
                height="2rem"
                viewBox="0 0 24 24"
                className="text-blue-400"
              >
                <circle cx="12" cy="6" r="4" fill="currentColor" />
                <path
                  fill="currentColor"
                  d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
                />
              </svg>
              {user.roleId?.name || 'User'}
            </p>

            {/* Email */}
            <p className="flex items-center text-lg font-medium text-gray-300 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2rem"
                height="2rem"
                viewBox="0 0 24 24"
                className="text-blue-400"
              >
                <path
                  fill="currentColor"
                  d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z"
                />
              </svg>
              {user.email}
            </p>

            {/* Joined Date */}
            <p className="flex items-center text-sm font-light text-gray-400 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2rem"
                height="2rem"
                viewBox="0 0 24 24"
                className="text-blue-400"
              >
                <g fill="none">
                  <path
                    stroke="currentColor"
                    stroke-width="1.5"
                    d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z"
                  />
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="1.5"
                    d="M7 4V2.5M17 4V2.5M2.5 9h19"
                  />
                  <path
                    fill="currentColor"
                    d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
                  />
                </g>
              </svg>
              Joined on {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* Update Profile Button */}
          <Link href={`/profile/edit/${user._id}`}>
            <button className="bg-blue-500 w-36 p-3 text-white rounded transition-colors duration-300 ease-in-out">
              Update Profile
            </button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default ProfileDetails;
