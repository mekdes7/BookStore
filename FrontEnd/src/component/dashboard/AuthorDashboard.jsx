import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBook from "./AddBook";
import API from "../../services/api";

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
 useEffect(() => {
  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem("token");
    const authorUser = localStorage.getItem("authorUser");

    console.log("🔐 ===== DASHBOARD AUTH CHECK =====");
    console.log("Token exists:", !!token);
    console.log("Token value:", token);
    console.log("Author user exists:", !!authorUser);
    console.log("Author user value:", authorUser);

    if (!token || !authorUser) {
      console.log("❌ Missing authentication data, redirecting to login");
      navigate("/login/author");
      return;
    }

    try {
      // Parse user data safely
      let userData;
      try {
        userData = JSON.parse(authorUser);
        console.log("👤 Parsed user data:", userData);
      } catch (parseError) {
        console.error("❌ Failed to parse authorUser:", parseError);
        navigate("/login/author");
        return;
      }

      const userFirstName = userData.firstName || userData.first_name;
      console.log("📝 First name found:", userFirstName);

      if (!userFirstName) {
        console.log("❌ No first name found in user data");
        navigate("/login/author");
        return;
      }

      setFirstName(userFirstName);

    // Test the books endpoint manually
const testBooksEndpoint = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch('http://localhost:5000/books/my-books', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Books endpoint status:', response.status);
    const data = await response.json();
    console.log('Books endpoint response:', data);
  } catch (error) {
    console.error('Books endpoint test failed:', error);
  }
};
testBooksEndpoint();
      
      if (error.response?.status === 401) {
        console.log("🔐 401 Unauthorized - Token might be invalid or expired");
        console.log("🔑 Token that was used:", localStorage.getItem("token"));
        localStorage.removeItem("token");
        localStorage.removeItem("authorUser");
        navigate("/login/author");
      } else {
        console.error("Other error:", error);
        setBooks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  checkAuthAndFetchData();
}, [navigate]);

  const handleDelete = async (bookToDelete) => {
    try {
       await API.delete(`http://localhost:5000/api/books/${bookToDelete.id}`);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookToDelete.id));
      alert("Book deleted successfully");
    } catch (err) {
      console.error("Error deleting book:", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowAddBook(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authorUser");
    navigate("/login/author");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full"
      style={{
        backgroundImage: "url('/bookbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      <div className="relative z-10 flex flex-col items-center justify-start pt-20">
     
        <div className="absolute top-5 left-4 right-4 z-20 flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer p-2 bg-opacity-20 hover:bg-opacity-40 transition"
          >
            <img src="/leftarrow.png" alt="Back" className="w-8 h-8" />
          </button>

          <div className="relative">
            <div
              className="flex items-center gap-2 text-white cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="font-semibold">Welcome, {firstName}</span>
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold uppercase">
                {firstName ? firstName.charAt(0) : "A"}
              </div>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-7 text-xl font-bold text-white bg-opacity-30 px-6 py-2 rounded-lg shadow-lg backdrop-blur-sm w-full max-w-md text-center">
          My Books
        </div>

        <button
          onClick={() => {
            setEditingBook(null);
            setShowAddBook(true);
          }}
          className="mt-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Book
        </button>

        <div className="mt-6 w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.length === 0 ? (
            <p className="text-white text-center col-span-full">
              No books added yet.
            </p>
          ) : (
            books.map((book, index) => (
              <div
                key={book.id || index}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <a href={book.book_file} target="_blank" rel="noopener noreferrer">
                  <img
                    src={book.coverUrl || book.book_cover}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x400?text=No+Cover";
                    }}
                  />
                </a>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold truncate">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Author: {book.author_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Category: {book.category}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Published:{" "}
                    {book.published_year
                      ? new Date(book.published_year).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {book.description}
                  </p>

                  <div className="mt-auto pt-3 flex justify-between text-sm text-blue-600">
                    <button
                      onClick={() => handleEdit(book)}
                      className="hover:underline text-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book)}
                      className="hover:underline text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddBook && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
            <button
              onClick={() => setShowAddBook(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
            >
              ✕
            </button>

            <AddBook
              goBack={() => setShowAddBook(false)}
              onBookAdded={(newBook) => {
                if (editingBook) {
                  setBooks((prev) =>
                    prev.map((b) => (b.id === newBook.id ? newBook : b))
                  );
                } else {
                  setBooks((prev) => [...prev, newBook]);
                }
                setEditingBook(null);
              }}
              editingBook={editingBook}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;