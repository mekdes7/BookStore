import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BellRing, Heart, Search, X } from "lucide-react";
import API from "../../services/api";
import { io } from "socket.io-client";

const ReaderDashboard = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [favoriteCategory, setFavoriteCategory] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lovedBooks, setLovedBooks] = useState(new Set());
  const [lovedCount, setLovedCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Improved localStorage parsing with better error handling
  const getStoredReaderUser = useCallback(() => {
    try {
      const stored = localStorage.getItem("readerUser");
      if (!stored || stored === "undefined" || stored === "null") return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing stored reader user:", error);
      localStorage.removeItem("readerUser");
      return null;
    }
  }, []);

  const getToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      return null;
    }
    return token;
  }, []);

  // Initialize API with token
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Make sure your API service sets the authorization header
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [getToken]);

  // Socket connection effect
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login/reader");
      return;
    }

    const socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth: {
        token: token // Add token to socket auth
      }
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      const storedReaderUser = getStoredReaderUser();
      if (storedReaderUser && storedReaderUser.id) {
        socket.emit("userJoined", { 
          userId: storedReaderUser.id, 
          role: "reader",
          token: token 
        });
      }
    });

    socket.on("newBookAdded", (book) => {
      console.log("New book (socket):", book);
      const newNotification = {
        id: `socket-${Date.now()}`,
        title: book.title || book.book_title || "New Book",
        category: book.category,
        author_firstname: book.author_firstname,
        author_lastname: book.author_lastname,
        author_name: book.author_name,
        book_cover: book.book_cover || book.coverUrl,
        book_file: book.book_file || book.book_file,
        timestamp: new Date().toLocaleString(),
        is_read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New Book Added!", {
          body: `${newNotification.title} by ${newNotification.author_name || `${newNotification.author_firstname || ""} ${newNotification.author_lastname || ""}`}`,
          icon: newNotification.book_cover,
        });
      }
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("connect_error", (err) => console.error("Socket connect error:", err));
    socket.on("auth_error", (err) => {
      console.error("Socket auth error:", err);
      handleAuthError();
    });

    return () => {
      socket.disconnect();
    };
  }, [getToken, getStoredReaderUser, navigate]);

  // Notification permission effect
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Handle authentication errors consistently
  const handleAuthError = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("readerUser");
    navigate("/login/reader");
  }, [navigate]);

  // Main data fetching effect
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login/reader");
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        
        // Fetch profile with error handling
        const profileRes = await API.get("/readers/profile");
        const user = profileRes.data; 
        
        if (!user) {
          throw new Error("No user data received");
        }
        
        setFirstName(user.first_name || user.firstName || "");
        setFavoriteCategory(user.favorite_category || user.favoriteCategory || "");
       
        localStorage.setItem("readerUser", JSON.stringify(user));

        // Fetch all data in parallel for better performance
        await Promise.all([
          fetchRecommendedBooks(user.favorite_category || user.favoriteCategory || ""),
          fetchMyBooks(),
          fetchLovedBooks(),
          fetchNotificationsFromServer()
        ]);
        
      } catch (err) {
        console.error("Error fetching profile / data:", err);
        
        if (err.response?.status === 401) {
          handleAuthError();
        } else {
          // For other errors, you might want to show a message but not logout
          console.error("Non-auth error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate, getToken, handleAuthError]);

  // API service functions with better error handling
  const fetchRecommendedBooks = async (category) => {
    try {
      const res = await API.get(`/books/recommended?categories=${encodeURIComponent(category)}`);
      if (res.data.success) {
        setRecommendedBooks(res.data.books || []);
      }
    } catch (err) {
      console.error("Error fetching recommended books:", err);
      if (err.response?.status === 401) {
        handleAuthError();
      }
    }
  };

  const fetchMyBooks = async () => {
    try {
      const res = await API.get("/books/reader-books");
      if (res.data.success) {
        setMyBooks(res.data.books || []);
      }
    } catch (err) {
      console.error("Error fetching my books:", err);
      if (err.response?.status === 401) {
        handleAuthError();
      }
    }
  };

  const fetchLovedBooks = async () => {
    try {
      const res = await API.get("/books/loved");
      if (res.data.success) {
        const lovedIds = new Set(res.data.books.map((b) => b.id || b._id));
        setLovedBooks(lovedIds);
        setLovedCount(lovedIds.size);
      }
    } catch (err) {
      console.error("Error fetching loved books:", err);
      if (err.response?.status === 401) {
        handleAuthError();
      }
    }
  };

  const fetchNotificationsFromServer = async () => {
    try {
      const res = await API.get("/books/notifications");
      const rows = res.data?.notifications || [];
      const mapped = rows.map((n) => ({
        id: n.id || n._id,
        title: n.title,
        category: n.category,
        author_firstname: n.author_firstname,
        author_lastname: n.author_lastname,
        author_name: `${n.author_firstname || ""} ${n.author_lastname || ""}`.trim(),
        book_cover: n.book_cover,
        book_file: n.book_file,
        is_read: !!n.is_read,
        timestamp: n.created_at ? new Date(n.created_at).toLocaleString() : new Date().toLocaleString(),
      }));

      setNotifications((prev) => {
        const merged = [...mapped, ...prev];
        const seen = new Set();
        return merged.filter((x) => {
          if (seen.has(x.id)) return false;
          seen.add(x.id);
          return true;
        });
      });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      if (err.response?.status === 401) {
        handleAuthError();
      }
    }
  };

  const toggleLove = async (bookId) => {
    try {
      const res = await API.post(`/books/${bookId}/love`);
      if (res.data.success) {
        setLovedBooks((prev) => {
          const updated = new Set(prev);
          if (res.data.loved) {
            updated.add(bookId);
          } else {
            updated.delete(bookId);
          }
          setLovedCount(updated.size);
          return updated;
        });
      }
    } catch (err) {
      console.error("Error toggling loved book:", err);
      if (err.response?.status === 401) {
        handleAuthError();
      }
    }
  };

  const clearNotifications = () => setNotifications([]);
  
  const removeNotification = (id) => 
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const handleReadBook = (book) => 
    window.open(book.book_file, "_blank", "noopener,noreferrer");

  const handleDownloadBook = (book) => {
    const fileName = `${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    const link = document.createElement("a");
    link.href = book.book_file;
    link.download = fileName;
    link.setAttribute("type", "application/pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("readerUser");
    navigate("/login/reader");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
      setShowNotifications(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading your dashboard...</div>
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

      <div className="relative z-10 min-h-screen text-white">
        <header className="flex justify-between items-center p-6">
          <button 
            onClick={() => navigate("/")} 
            className="p-2 hover:bg-gray-800 rounded-full transition"
          >
            <img src="/leftarrow.png" alt="Back" className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Heart size={24} className="text-red-500" />
              {lovedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {lovedCount}
                </span>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications((s) => !s);
                }} 
                className="relative p-2 hover:bg-gray-800 rounded-full transition"
              >
                <BellRing size={24} className="text-white" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold">Notifications ({notifications.length})</h3>
                    <div className="flex gap-2">
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearNotifications} 
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Clear All
                        </button>
                      )}
                      <button 
                        onClick={() => setShowNotifications(false)} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No new notifications</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-gray-50 transition">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">New Book Added! </p>
                              <p className="text-sm mt-1">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                by {n.author_name || `${n.author_firstname || ""} ${n.author_lastname || ""}`} • {n.category}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
                            </div>
                            <button 
                              onClick={() => removeNotification(n.id)} 
                              className="text-gray-400 hover:text-gray-600 ml-2"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div 
                className="flex items-center gap-2 text-white cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown((s) => !s);
                }}
              >
                <span className="font-semibold">Welcome, {firstName}</span>
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold uppercase">
                  {firstName ? firstName.charAt(0) : "U"}
                </div>
              </div>

              {showDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-50"
                  onClick={(e) => e.stopPropagation()}
                >
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
        </header>

        <main className="p-6 space-y-8">
          <div className="relative w-full sm:w-[400px] mb-6">
            <input 
              type="text" 
              placeholder="Search your books..." 
              className="w-full p-3 pr-10 rounded-lg bg-gray-800/50 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base" 
              autoComplete="off"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <h2 className="text-2xl font-bold mb-6">Recommended for you</h2>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedBooks.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-300">
                  No recommended books found for your favorite category: {favoriteCategory || "None set"}
                </p>
              </div>
            ) : (
              recommendedBooks.map((book) => (
                <div key={book.id || book._id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition group">
                  <img 
                    src={book.book_cover} 
                    alt={book.title} 
                    className="w-full h-48 object-cover rounded mb-3" 
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x400/cccccc/666666?text=No+Cover";
                    }} 
                  />
                  <h3 className="font-semibold mb-1 truncate">{book.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    by {book.author_firstname} {book.author_lastname}
                  </p>
                  <p className="text-xs text-amber-400 mb-2">
                    {book.published_year?.split("T")[0]}
                  </p>
                  <p className="text-xs italic text-gray-400 mb-3">{book.category}</p>

                  <div className="grid sm:flex gap-1 text-sm">
                    <button 
                      onClick={() => handleReadBook(book)} 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm"
                    >
                      Read
                    </button>
                    <button 
                      onClick={() => handleDownloadBook(book)} 
                      className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm"
                    >
                      Download
                    </button>
                    <button 
                      onClick={() => toggleLove(book.id || book._id)} 
                      className="flex items-center justify-center px-3 py-2 rounded text-sm"
                    >
                      <Heart 
                        size={22} 
                        className={lovedBooks.has(book.id || book._id) ? "text-red-500" : "text-white"} 
                        fill={lovedBooks.has(book.id || book._id) ? "red" : "none"} 
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ReaderDashboard;