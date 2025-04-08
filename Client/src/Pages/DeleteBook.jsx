import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../Component/BackButton';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../Component/Spinner';
import { useSnackbar } from 'notistack';

const DeleteBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [bookCover, setBookCover] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
 const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:4646/books/${id}`)
      .then((res) => {
        setAuthor(res.data.author);
        setPublishYear(res.data.publishYear);
        setTitle(res.data.title);
        setBookCover(res.data.bookCover);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened');
        console.log(error);
      });
  }, [id]);

  const handleDeleteBook = () => {
    setLoading(true);
    axios.delete(`http://localhost:4646/books/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book Deleted successfully',{variant:'success'})
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('error',{variant:'error'})
        console.log(error);
      });
  };

  return (
    <>
      <BackButton />
      <div className='p-4 justify-center items-center text-white ml-[300px]'>
        <h1 className='text-3xl my-4'>Delete Book</h1>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* Display book details */}
            <div className='mb-4 text-xl'>
              <p><strong>Title:</strong> {title}</p>
              <p><strong>Author:</strong> {author}</p>
              <p><strong>Publish Year:</strong> {publishYear}</p>
              <p><strong>Book Cover:</strong> {bookCover}</p>
            </div>

            {/* Delete confirmation box */}
            <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto text-black'>
              <h3 className='text-2xl text-white'>Are you sure you want to delete this book?</h3>
              <div className='flex justify-center items-center'>
              <button 
                className='p-4 bg-red-500 text-white m-8 rounded-full w-32 hover:bg-red-600 transition-colors'
                onClick={handleDeleteBook}
              >
                Delete
              </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DeleteBook;