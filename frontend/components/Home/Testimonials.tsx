// components/Testimonials.tsx
import React from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section className=" text-white py-16 px-8 md:px-16 lg:px-24">
      <h2 className="text-4xl font-bold text-center mb-8 tracking-tight">
        What Our Readers Say
      </h2>

      <p className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-12">
        We value our readers' feedback and strive to provide the best content
        possible. Here's what they have to say:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-800 rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0px_0px_4px_rgba(41,125,204,1)]"
          >
            <p className="text-gray-400 italic mb-4">"{testimonial.message}"</p>
            <h3 className="text-lg font-semibold">{testimonial.name}</h3>
            <p className="text-gray-500 text-sm">{testimonial.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
