import React from 'react'
import { BiUserCircle } from 'react-icons/bi'
import { PiBookOpenTextLight } from 'react-icons/pi'
import { AiOutlineClose } from 'react-icons/ai'

const BookModel = ({ book, onClose }) => {
    return (
        <div 
            className='fixed bg-black bg-opacity-60 bottom-0 flex justify-center items-center left-0 right-0 z-50 cursor-pointer' 
            onClick={onClose}
        >
            <div 
                onClick={(event) => event.stopPropagation()}
                className='w-[600px] max-w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl p-4 flex flex-col relative'
            >
                <AiOutlineClose 
                    className='absolute right-6 top-6 text-3xl text-red-600 cursor-pointer' 
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                />
                <h2 className='w-fit px-4 py-1 bg-red-300 rounded-lg'>
                    {book.publishYear}
                </h2>
                <h4 className='my-2 text-gray-500'>{book._id}</h4>
                <div className='flex justify-start items-center gap-x-2'>
                    <PiBookOpenTextLight className='text-red-300 text-2xl' />
                    <h2 className='my-1'>{book.title}</h2>
                </div>
                <div className='flex justify-center items-center gap-x-2'>
                    <BiUserCircle className='text-red-300 text-2xl' />
                    <h2 className='my-1'>{book.author}</h2>
                </div>
                <p className='text-black'>Anything you want to show</p>
            </div>
        </div>
    )
}

export default BookModel