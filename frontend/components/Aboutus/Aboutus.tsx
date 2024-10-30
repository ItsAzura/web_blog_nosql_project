// components/AboutUs.tsx
import React from 'react';
import { TeamMember } from '../../interface';

interface AboutUsProps {
  members: TeamMember[];
}

const AboutUsComponent: React.FC<AboutUsProps> = ({ members }) => {
  return (
    <section className="text-white py-16 px-8 md:px-16 lg:px-24">
      <h2 className="text-4xl font-bold text-center mb-8 tracking-tight text-white">
        About Us
      </h2>

      <p className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-12">
        Our blog is dedicated to providing valuable insights, in-depth articles,
        and a passionate community focused on sharing knowledge and ideas. Our
        team works hard to bring fresh and unique perspectives to every article.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]"
          >
            <div className="relative h-48">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-400 transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-sm text-blue-500 mb-2">{member.role}</p>
              <p className="text-gray-400 text-sm line-clamp-3">
                {member.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUsComponent;
