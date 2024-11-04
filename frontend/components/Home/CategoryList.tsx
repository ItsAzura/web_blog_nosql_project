import React from 'react';
import { ICategory } from '@/interface';

interface CategoryListProps {
  categories: ICategory[];
}

const randomPostCount = () => Math.floor(Math.random() * 100);

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <section className="text-white py-16 px-8 md:px-16 lg:px-24">
      <h2 className="text-4xl font-bold text-center mb-12 tracking-wide uppercase drop-shadow-[0px_0px_6px_rgba(41,125,204,1)] transition-shadow">
        Categories
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <li
            key={category._id}
            className="relative bg-gray-800 rounded-lg shadow-md shadow-black/30 p-8 flex items-center justify-between 
                      transition-transform duration-300 hover:scale-105 hover:bg-gray-700 hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]"
          >
            <span className="text-2xl font-semibold text-white group-hover:text-blue-500 transition-colors duration-300">
              {category.name}
            </span>
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-3 py-1 text-xs font-semibold shadow-md">
              {randomPostCount()} Blogs
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-20 rounded-lg pointer-events-none group-hover:opacity-30 transition-opacity duration-300"></div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CategoryList;
