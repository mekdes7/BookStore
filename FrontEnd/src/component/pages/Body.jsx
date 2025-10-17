import React, { useState } from 'react';

const Body = () => {
  const [showAll, setShowAll] = useState(false);

  const bookCovers = [
    '/cover.jpg',
    '/cover1.jpg',
    "/don't overthink.jpg",
    '/jpanese.jpg',
    '/self learn.jpg',
    '/the power of habit.jpg',
    '/the power of now.jpg',
    '/think.jpg',
    '/mindset.jpg',
  ];

  return (
    <div className="px-8 overflow-hidden py-6">
      <div className="text-center mb-6">
        <h2 className="font-bold text-3xl">Book Categories</h2>
      </div>

      <h4 className="text-xl font-semibold mb-4 flex justify-start">Self-help books</h4>
      <div className="flex overflow-x-auto gap-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pb-4">
        {bookCovers.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Book ${index}`}
            className="w-40 h-40 object-cover rounded-lg shadow-2xl transform transition duration-300 hover:scale-110"
          />
        ))}
      </div>

      
      {showAll && (
        <>
          <h4 className="text-xl font-semibold mt-8 mb-4 flex justify-start">Inspirational Books</h4>
          <div className="flex overflow-x-auto gap-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pb-4">
            {bookCovers.map((src, index) => (
              <img
                key={`inspiration-${index}`}
                src={src}
                alt={`Book ${index}`}
                className="w-40 h-40 object-cover rounded-lg shadow-2xl transform transition duration-300 hover:scale-110"
              />
            ))}
          </div>

          <h4 className="text-xl font-semibold mt-8 mb-4 flex justify-start">Psychology Books</h4>
          <div className="flex overflow-x-auto gap-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pb-4">
            {bookCovers.map((src, index) => (
              <img
                key={`psych-${index}`}
                src={src}
                alt={`Book ${index}`}
                className="w-40 h-40 object-cover rounded-lg shadow-2xl transform transition duration-300 hover:scale-110"
              />
            ))}
          </div>
        </>
      )}

     
      <div className="text-center mt-8">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : 'View All Categories'}
        </button>
      </div>
    </div>
  );
};

export default Body;
