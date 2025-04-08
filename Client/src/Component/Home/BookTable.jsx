import React from 'react'
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const BookTable = ({books}) => {
  return (
    <div>
          <table className='w-full border-separate border-spacing-2'>
            <thead className='text-2xl'>
              <tr>
                <th className='border border-slate-600 rounded-md'>No</th>
                <th className='border border-slate-600 rounded-md'>Title</th>
                <th className='border border-slate-600 rounded-md max-md:hidden'>Author</th>
                <th className='border border-slate-600 rounded-md max-md:hidden'>Publish Year</th>
                <th className='border border-slate-600 rounded-md'>Operations</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book._id} className='h-8'>
                  <td className='border border-slate-700 rounded-md text-center'>{index + 1}</td>
                  <td className='border border-slate-700 rounded-md text-center'>{book.title}</td>
                  <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{book.author}</td>
                  <td className='border border-slate-700 rounded-md text-center'>{book.publishYear}</td>
                  <td className='border border-slate-700 rounded-md text-center'>
                    <div className='flex justify-center gap-x-4'>
                      <Link to={`/books/details/${book._id}`}>
                        <span className='flex border border-white px-4 gap-1.5 bg-green-200'>
                          <BsInfoCircle className='text-2xl text-green-800' />
                          <span className='text-black'>Show</span></span>
                      </Link>
                      <Link to={`/books/edit/${book._id}`}>
                        <span className='flex border-white px-4 gap-1.5 bg-orange-300'>

                          <AiOutlineEdit className='text-yellow-950 text-2xl' />
                          <span className='text-black'>Edit</span>
                        </span>
                      </Link>
                      <Link to={`/books/delete/${book._id}`}>
                        <span className='bg-red-200 flex border-white px-4 gap-1.5'>
                          <MdOutlineDelete className=' text-red-800 text-2xl'/>
                          <span className='text-black'>Delete</span>
                        </span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
  )
}

export default BookTable
