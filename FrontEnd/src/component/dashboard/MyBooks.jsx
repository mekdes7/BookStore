import { useState, useEffect } from "react";
import API, { setAuthHeader } from "../../services/api.js";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setAuthHeader(token);
      const response = await API.get("/books/my-books");
      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading books...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Books</h2>
      {books.length === 0 ? (
        <p>No books found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id} className="border rounded-lg p-4">
              <img 
                src={book.coverUrl} 
                alt={book.title}
                className="w-full h-48 object-cover mb-2"
                onError={(e) => {
                  e.target.src = '/placeholder-cover.jpg';
                }}
              />
              <h3 className="font-bold">{book.title}</h3>
              <p className="text-sm text-gray-600">By: {book.author_name}</p>
              <p className="text-sm">Category: {book.category}</p>
              <p className="text-sm">Year: {book.publishedYear}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}