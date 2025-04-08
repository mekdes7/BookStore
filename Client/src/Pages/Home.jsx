import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Spinner from '../Component/Spinner';
import BookCard from '../Component/Home/BookCard';
import BookTable from '../Component/Home/BookTable';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState(() => {
    // Get the saved view type from localStorage, default to 'table' if not found
    return localStorage.getItem('bookViewType') || 'table';
  });

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:4646/books')
      .then((res) => {
        setBooks(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleViewTypeChange = (type) => {
    setShowType(type);
    // Save the view type to localStorage
    localStorage.setItem('bookViewType', type);
  };

  return (
    <>
      <div className='p-4 bg-transparent h-auto w-[1200px] ml-[50px] flex-col 
      rounded-lg shadow-lg font-bold text-white'>
        <div className='flex justify-between items-center'>
          <button 
            className={`px-4 py-1 rounded-lg ${
              showType === 'table' ? 'bg-sky-600' : 'bg-sky-500 hover:bg-sky-600'
            }`}
            onClick={() => handleViewTypeChange('table')}
          >
            Table
          </button>
          <button 
            className={`px-4 py-1 rounded-lg ${
              showType === 'card' ? 'bg-sky-600' : 'bg-sky-500 hover:bg-sky-600'
            }`}
            onClick={() => handleViewTypeChange('card')}
          >
            Card
          </button>
        </div>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl my-8'>Books List</h1>
          <Link to='/books/create'>
            <span className="flex items-center gap-2 relative">
              <MdOutlineAddBox className="bg-green-200 text-2xl" />
              <span className="text-white text-2xl">Add Book</span>
            </span>
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : showType === 'table' ? (
          <BookTable books={books} />
        ) : (
          <BookCard books={books}/>
        )}
      </div>
    </>
  );
};

export default Home;