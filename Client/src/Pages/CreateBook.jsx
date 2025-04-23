import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../Component/BackButton';
import Spinner from '../Component/Spinner';
import { useSnackbar } from 'notistack';

const API_BASE_URL = 'https://bookstore-sirh.onrender.com';

const CreateBook = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [bookCover, setBookCover] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const localBooks = localStorage.getItem('books');
    if (localBooks) setBooks(JSON.parse(localBooks));

    axios.get(`${API_BASE_URL}/books`)
      .then((res) => {
        setBooks(res.data.data);
        localStorage.setItem('books', JSON.stringify(res.data.data));
      })
      .catch((err) => {
        const offline = localStorage.getItem('books');
        if (offline) setBooks(JSON.parse(offline));
      });
  }, []);

  useEffect(() => {
    const syncOfflineBooks = async () => {
      const unsynced = JSON.parse(localStorage.getItem('unsyncedBooks')) || [];

      const synced = [];
      for (const book of unsynced) {
        try {
          await axios.post(`${API_BASE_URL}/books`, book);
          synced.push(book);
        } catch {
          return;
        }
      }

      const remaining = unsynced.filter(b => !synced.includes(b));
      localStorage.setItem('unsyncedBooks', JSON.stringify(remaining));
    };

    syncOfflineBooks();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookCover(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
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

    const newBook = {
      title,
      author,
      publishYear,
      bookCover: previewImage,
    };

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('publishYear', publishYear);
      formData.append('bookCover', bookCover);

      const response = await axios.post(`${API_BASE_URL}/books`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedBooks = [...books, response.data];
      setBooks(updatedBooks);
      localStorage.setItem('books', JSON.stringify(updatedBooks));

      enqueueSnackbar('Book Created successfully', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Saved locally. Will sync when online.', { variant: 'warning' });

      const unsynced = JSON.parse(localStorage.getItem('unsyncedBooks')) || [];
      unsynced.push(newBook);
      localStorage.setItem('unsyncedBooks', JSON.stringify(unsynced));

      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton />
      <div className='p-4 flex flex-col items-center'>
        <h1 className='text-2xl md:text-3xl font-semibold text-white my-4 text-center'>Create Book</h1>
        {loading && <Spinner />}
        <div className='w-full max-w-lg border-2 border-sky-400 rounded-xl p-6 bg-opacity-20 backdrop-blur-md'>
          <form onSubmit={handleSaveBook} className='space-y-4'>
            <div>
              <label className='block text-white text-lg mb-1'>Title</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-3 py-2 border border-gray-500 rounded-lg bg-transparent text-white'
              />
            </div>

            <div>
              <label className='block text-white text-lg mb-1'>Author</label>
              <input
                type='text'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className='w-full px-3 py-2 border border-gray-500 rounded-lg bg-transparent text-white'
              />
            </div>

            <div>
              <label className='block text-white text-lg mb-1'>Publish Year</label>
              <input
                type='text'
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value)}
                className='w-full px-3 py-2 border border-gray-500 rounded-lg bg-transparent text-white'
              />
            </div>

            <div>
              <label className='block text-white text-lg mb-1'>Book Cover</label>
              {previewImage && (
                <img src={previewImage} alt='Preview' className='h-40 object-cover rounded-lg mb-2' />
              )}
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='w-full px-3 py-2 border border-gray-500 rounded-lg text-white bg-transparent'
              />
            </div>

            <div className='flex justify-center'>
              <button
                type='submit'
                className='bg-sky-500 text-white px-6 py-2 rounded-full hover:bg-sky-600 transition-all'
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateBook;
