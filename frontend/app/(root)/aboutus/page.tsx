import React from 'react';
import AboutUsComponent from '../../../components/Aboutus/Aboutus';
import { TeamMember } from '../../../interface';

const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Azura',
    role: 'CEO & Founder',
    imageUrl: 'alex.jpg',
    description:
      'With a vision to build a community-driven blog, Alex leads the team and oversees strategic direction, ensuring alignment with our mission to provide quality content for readers.',
  },
  {
    id: '2',
    name: 'Azura',
    role: 'Frontend Developer',
    imageUrl: 'taylor.jpg',
    description:
      'Azura specializes in creating interactive, user-friendly interfaces and works to make the website visually appealing and responsive across all devices.',
  },
  {
    id: '3',
    name: 'Azura',
    role: 'UI/UX Designer',
    imageUrl: 'morgan.jpg',
    description:
      'Azura designs user-centered interfaces, focusing on creating seamless experiences that enhance user engagement and make content easily accessible.',
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen ">
      <AboutUsComponent members={mockMembers} />
    </div>
  );
};

export default AboutUs;
