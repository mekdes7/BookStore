import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorDashboard from './AuthorDashboard';
import AddBook from './AddBook';
import API from "../../services/api.js";

export default function AuthorPanel() {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');
  const authorUser = localStorage.getItem('authorUser');

  useEffect(() => {
    
    if (!token || !authorUser) {
      console.log('No authentication found, redirecting to login...');
      navigate('/login/author');
      return;
    }

    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        console.log('Fetching books with token:', token ? 'Token exists' : 'No token');
        
        const response = await API.get("/books/my-books", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Books fetched successfully:', response.data);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        
        if (error.response?.status === 401) {
          console.log('Token expired or invalid, redirecting to login...');
          localStorage.removeItem('token');
          localStorage.removeItem('authorUser');
          navigate('/login/author');
        } else {
          setBooks([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [token, authorUser, navigate]);

  const handleBookAdded = (book) => {
    setBooks(prev => [book, ...prev]);
    setShowAdd(false);
  };

  const handleDelete = (updatedBooks) => setBooks(updatedBooks);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading your books...</div>
      </div>
    );
  }

  return (
    <div>
      <AuthorDashboard 
        books={books} 
        goToAddBook={() => setShowAdd(true)} 
        onDelete={handleDelete}
      />
      {showAdd && (
        <AddBook 
          goBack={() => setShowAdd(false)} 
          onBookAdded={handleBookAdded} 
        />
      )}
    </div>
  );
}