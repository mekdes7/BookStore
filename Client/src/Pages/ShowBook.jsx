import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../Component/BackButton';
import Spinner from '../Component/Spinner';

const ShowBook = () => {
  const [book, setBook] = useState(null); 
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:4646/books/${id}`)
      .then((res) => {
        setBook(res.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching book:", err);
        setLoading(false);
      });
  }, [id]); // Include `id` in dependencies to handle updates

  if (loading) return <Spinner />;
  if (!book) return <p className="text-red-600">Book not found</p>;

  return (
    <>
    <BackButton />
    <div className="p-4 justify-center items-center text-white ml-[410px]">
      
      <h1 className="text-3xl my-4">Books Details</h1>

      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
        <div className="my-4">
          <span className="text-xl mr-4">ID:</span>
          <span>{book._id}</span>
        </div>

        <div className="my-4">
          <span className="text-xl mr-4">Title:</span>
          <span>{book.title}</span>
        </div>

        <div className="my-4">
          <span className="text-xl mr-4">Author:</span>
          <span>{book.author}</span>
        </div>

        <div className="my-4">
          <span className="text-xl mr-4">Published Year:</span>
          <span>{book.publishYear}</span>
        </div>

        <div className="my-4">
          <span className="text-xl mr-4 ">Create Time:</span>
          <span>{new Date(book.createdAt).toLocaleString()}</span>
        </div>

        <div className="my-4">
          <span className="text-xl mr-4 ">Last Update Time:</span>
          <span>{new Date(book.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
    </>
  );
};

export default ShowBook;
