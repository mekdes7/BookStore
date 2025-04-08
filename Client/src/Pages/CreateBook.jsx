import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../Component/BackButton';
import Spinner from '../Component/Spinner';
import { useSnackbar } from 'notistack';

const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [bookCover, setBookCover] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookCover(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    
    if (!title || !author || !publishYear || !bookCover) {
      enqueueSnackbar('Please fill all fields including book cover', { variant: 'error' });
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('publishYear', publishYear);
      formData.append('bookCover', bookCover);

      const response = await axios.post('http://localhost:4646/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setLoading(false);
      enqueueSnackbar('Book Created successfully', { variant: 'success' });
      navigate('/');
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error creating book', { variant: 'error' });
      console.log(error);
    }
  };

  return (
    <>
      <BackButton />
      <div className='p-4 justify-center items-center ml-[410px]'>
        <h1 className='text-3xl my-4 text-white'>Create Book</h1>
        {loading ? <Spinner /> : ''}
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
          <div className='my-4'>
            <label className='text-xl mr-4 text-white'>Title</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-4xl text-white'
            />
            <label className='text-xl mr-4 text-white'>Author</label>
            <input
              type='text'
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-4xl text-white'
            />
            <label className='text-xl mr-4 text-white'>PublishYear</label>
            <input
              type='text'
              value={publishYear}
              onChange={(e) => setPublishYear(e.target.value)}
              className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-4xl text-white'
            />
            <div className="mb-4">
              <label className="block text-white mb-2">Book Cover</label>
              {previewImage && (
                <div className="mb-3">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-40 object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border-2 border-gray-500 px-2 w-full py-1.5 rounded-lg text-white bg-transparent"
              />
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              className="p-2 bg-sky-500 m-8 rounded-full w-32 text-white"
              onClick={handleSaveBook}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBook;