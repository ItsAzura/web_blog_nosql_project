'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IUser } from '@/interface';

interface UserMenuProps {
  user: IUser;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const placeholderAvatar = `https://avatar.iran.liara.run/public`;

  return (
    <div className="relative flex items-center space-x-4">
      <span className="text-gray-300 text-lg font-semibold">
        {user.username}
      </span>

      <button onClick={toggleDropdown} className="focus:outline-none">
        <Image
          src={user.profilePicture || placeholderAvatar}
          alt="User avatar"
          width={40}
          height={40}
          className="rounded-full border border-gray-500 shadow-md hover:shadow-lg duration-300"
        />
      </button>

      {isOpen && (
        <div className="z-10 absolute right-0 mt-60 w-48 bg-gray-900 rounded-lg shadow-lg py-2 duration-300 ease-out transform origin-top-right scale-95">
          <Link
            href={`/profile/${user._id}`}
            className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white duration-300"
          >
            Profile
          </Link>
          <Link
            href={`/workspace/${user._id}`}
            className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white duration-300"
          >
            Work Space
          </Link>
          <Link
            href={`/favorite/${user._id}`}
            className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white duration-300"
          >
            Favorite
          </Link>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-red-500 duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
