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

  // Load books from localStorage or backend
  useEffect(() => {
    const localBooks = localStorage.getItem('books');
    if (localBooks) setBooks(JSON.parse(localBooks));

    axios.get(`${API_BASE_URL}/books`)
  .then((res) => {
    setBooks(res.data.data);
    localStorage.setItem('books', JSON.stringify(res.data.data));
  })
  .catch((err) => {
    console.error('Backend fetch failed, loading offline books:', err.message);
    const offline = localStorage.getItem('books');
    if (offline) setBooks(JSON.parse(offline));
  });

  }, []);

  // Sync offline books
  useEffect(() => {
    const syncOfflineBooks = async () => {
      const unsynced = JSON.parse(localStorage.getItem('unsyncedBooks')) || [];

      const synced = [];
      for (const book of unsynced) {
        try {
          await axios.post(`${API_BASE_URL}/books`, book);
          synced.push(book);
        } catch {
          console.log('Still offline or sync failed.');
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
      bookCover: previewImage, // for offline/base64
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
      // Offline fallback
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
      <div className='p-4 justify-center items-center ml-[410px]'>
        <h1 className='text-3xl my-4 text-white'>Create Book</h1>
        {loading && <Spinner />}
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
          <div className='my-4'>
            <label className='text-xl text-white'>Title</label>
            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-lg text-white bg-transparent' />
            
            <label className='text-xl text-white'>Author</label>
            <input type='text' value={author} onChange={(e) => setAuthor(e.target.value)} className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-lg text-white bg-transparent' />

            <label className='text-xl text-white'>Publish Year</label>
            <input type='text' value={publishYear} onChange={(e) => setPublishYear(e.target.value)} className='border-2 border-gray-500 px-2 w-full py-1.5 rounded-lg text-white bg-transparent' />

            <label className="block text-white mb-2 mt-4">Book Cover</label>
            {previewImage && <img src={previewImage} alt="Preview" className="h-40 object-cover rounded-lg mb-3" />}
            <input type="file" accept="image/*" onChange={handleFileChange} className="border-2 border-gray-500 px-2 w-full py-1.5 rounded-lg text-white bg-transparent" />
          </div>

          <div className="flex justify-center items-center">
            <button className="p-2 bg-sky-500 m-8 rounded-full w-32 text-white" onClick={handleSaveBook}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBook;
