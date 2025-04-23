import React from 'react'
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const BookTable = ({ books }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-2">
        <thead className="text-xl sm:text-2xl">
          <tr>
            <th className="border border-slate-600 rounded-md">No</th>
            <th className="border border-slate-600 rounded-md">Title</th>
            <th className="border border-slate-600 rounded-md max-md:hidden">Author</th>
            <th className="border border-slate-600 rounded-md max-md:hidden">Publish Year</th>
            <th className="border border-slate-600 rounded-md">Operations</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book._id} className="h-12 text-sm sm:text-base">
              <td className="border border-slate-700 rounded-md text-center">{index + 1}</td>
              <td className="border border-slate-700 rounded-md text-center">{book.title}</td>
              <td className="border border-slate-700 rounded-md text-center max-md:hidden">{book.author}</td>
              <td className="border border-slate-700 rounded-md text-center max-md:hidden">{book.publishYear}</td>
              <td className="border border-slate-700 rounded-md text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <Link to={`/books/details/${book._id}`}>
                    <span className="flex items-center gap-1 border border-white px-2 py-1 bg-green-200 rounded-md">
                      <BsInfoCircle className="text-green-800 text-lg" />
                      <span className="text-black">Show</span>
                    </span>
                  </Link>
                  <Link to={`/books/edit/${book._id}`}>
                    <span className="flex items-center gap-1 border border-white px-2 py-1 bg-orange-300 rounded-md">
                      <AiOutlineEdit className="text-yellow-950 text-lg" />
                      <span className="text-black">Edit</span>
                    </span>
                  </Link>
                  <Link to={`/books/delete/${book._id}`}>
                    <span className="flex items-center gap-1 border border-white px-2 py-1 bg-red-200 rounded-md">
                      <MdOutlineDelete className="text-red-800 text-lg" />
                      <span className="text-black">Delete</span>
                    </span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default BookTable
