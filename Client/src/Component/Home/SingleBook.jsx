import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PiBookOpenTextLight } from 'react-icons/pi'
import { BiUserCircle, BiShow } from 'react-icons/bi'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsCalendar, BsInfoCircle } from 'react-icons/bs'
import { MdOutlineDelete } from 'react-icons/md'
import BookModel from './BookModel'

const SingleBook = ({ book }) => {
    const [showModel, setShowModel] = useState(false);
    console.log("Book Data:", book);
console.log("Book Cover URL:", book.bookCover);

    return (
        <div className='flex flex-wrap gap-6 justify-center m-4'>
        <div
            key={book._id}
            className='border-2 border-gray-500 rounded-lg h-fit px-4 py-2 relative hover:shadow-xl 
    w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 flex flex-col items-start space-y-3 hover:bg-black '>
            
            {book.bookCover ? (
    <div className='mb-3 flex justify-center w-full'>
        <img
            src={book.bookCover}
            alt={`Cover of ${book.title}`}
            className='object-cover rounded-lg shadow-md'
            onError={(e) => { e.target.src = '/fallback-image.jpg' }} 
        />
    </div>
) : (
    <p className="text-gray-500">No Cover Available</p>
)}

            
            <div>
                <div className='flex justify-start items-center gap-x-2'>
                    <PiBookOpenTextLight className='text-white text-2xl' />
                    <h2 className='my-1'>{book.title}</h2>
                </div>
                <div className='flex justify-start gap-x-2'>
                    <BiUserCircle className='text-white text-2xl' />
                    <h2 className='my-1'>{book.author}</h2>
                </div>
                <div className='flex justify-start gap-x-2'>
                    <BsCalendar className='text-white text-2xl' />
                    <h2 className='my-1'>{book.publishYear}</h2>
                </div>
            </div>
            
            <div className='flex justify-between items-center gap-x-2 mt-4 p-4'>
                {/* <BiShow
                    className='text-3xl text-blue-300 hover:text-black cursor-pointer'
                    onClick={() => setShowModel(true)}
                /> */}
                <Link to={`/books/details/${book._id}`}>
                    <BsInfoCircle className='text-2xl text-green-300 hover:text-white' />
                </Link>
                <Link to={`/books/edit/${book._id}`}>
                    <AiOutlineEdit className='text-2xl text-yellow-300 hover:text-white' />
                </Link>
                <Link to={`/books/delete/${book._id}`}>
                    <MdOutlineDelete className='text-2xl text-red-300 hover:text-white' />
                </Link>
            </div>
            
            {showModel && (
                <BookModel book={book} onClose={() => setShowModel(false)} />
            )}
        </div>
        </div>
    )
}

export default SingleBook