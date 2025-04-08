import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../Component/BackButton';
import Spinner from '../Component/Spinner';
import { useSnackbar } from 'notistack';

const UpdateBook = () => {
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
    axios.get(`http://localhost:4646/books/${id}`).then((res) => {
      setAuthor(res.data.author);
      setPublishYear(res.data.publishYear)
      setTitle(res.data.title)
      setBookCover(res.data.bookCover)
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      alert('An error happend')
      console.log(error)
    })
  }, [])
  const handleEditBook = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("publishYear", publishYear);
    if (bookCover instanceof File) {
      formData.append("bookCover", bookCover); 
    }
    
  
    setLoading(true);
    axios.put(`http://localhost:4646/books/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(() => {
      setLoading(false);
      enqueueSnackbar("Book Edited successfully", { variant: "success" });
      navigate("/");
    })
    .catch((error) => {
      setLoading(false);
      enqueueSnackbar("Error updating book", { variant: "error" });
      console.log(error);
    });
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
   if (file) {
    setBookCover(file); 
  }
    
  };
  {bookCover && (
    <div className="mt-4 flex justify-center">
      <img src={bookCover} alt="Book Cover Preview" className="h-32 w-24 object-cover rounded-lg shadow-md" />
    </div>
  )}
    

  return (
    <>
      <BackButton />
      <div className="p-4 justify-center items-center text-white ml-[410px]">


        <h1 className='text-3xl my-4'>Edit Book</h1>
        {loading ? <Spinner /> : ''}
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
          <div className='my-4'>
            <label className='text-xl mr-4'>Title</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-4xl text-white'
            />
            <label className='text-xl mr-4'>Author</label>
            <input
              type='text'
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-4xl text-white'
            />
            <label className='text-xl mr-4'>PublishYear</label>
            <input
              type='text'
              value={publishYear}
              onChange={(e) => setPublishYear(e.target.value)}
              className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-4xl text-white'
            />
            <label className='text-xl mr-4'>Book Cover</label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => handleImageChange(e)}
              className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-4xl text-white '
            />

          </div>
          <div className='flex justify-center items-center'>
            <button className='p-2 bg-sky-300 text-black m-8 rounded-full w-32 hover:bg-sky-400' onClick={handleEditBook}>Edit</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateBook
