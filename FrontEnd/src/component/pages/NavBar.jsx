import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      setActive('home');
    } else if (
      location.pathname === '/login/reader' ||
      location.pathname === '/login/author'
    ) {
      setActive('mybooks');
    }
  }, [location.pathname]);

  const handleScrollToCategories = () => {
    setActive('categories');
    setMenuOpen(false);
    const section = document.getElementById('book-categories');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    setActive('home');
    setMenuOpen(false);
    navigate('/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleMyBooksClick = () => {
    setActive('mybooks');
    setMenuOpen(false);
    navigate('/login/reader');
  };

  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
      
        <div className="w-32 flex-shrink-0">
          <img
            src="/bookstore.png"
            alt="Bookstore Logo"
            className="w-full h-auto object-contain"
          />
        </div>

     
        <div className="sm:hidden z-50">
          <button onClick={() => setMenuOpen(!menuOpen)} className='text-blue-700'>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden sm:flex gap-8 text-blue-700 font-semibold">
          <button
            onClick={handleHomeClick}
            className={`px-3 py-1 rounded ${active === 'home' ? 'bg-blue-500 text-white' : 'hover:text-blue-400'}`}
          >
            Home
          </button>
          <button
            onClick={handleScrollToCategories}
            className={`px-3 py-1 rounded ${active === 'categories' ? 'bg-blue-500 text-white' : 'hover:text-blue-400'}`}
          >
            Book Categories
          </button>
          <button
            onClick={handleMyBooksClick}
            className={`px-3 py-1 rounded ${active === 'mybooks' ? 'bg-blue-500 text-white' : 'hover:text-blue-400'}`}
          >
            My Books
          </button>
        </div>
      </div>

     
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-2 px-4 pb-4 text-blue-700 font-semibold bg-white shadow-lg">
          <button
            onClick={handleHomeClick}
            className={`text-left px-3 py-1 rounded ${active === 'home' ? 'bg-blue-500 text-white' : 'hover:text-blue-400'}`}
          >
            Home
          </button>
          <button
            onClick={handleScrollToCategories}
            className={`text-left px-3 py-1 rounded ${active === 'categories' ? 'bg-blue-500 text-white' : 'hover:text-blue-400'}`}
          >
            Book Categories
          </button>
          <button
            onClick={handleMyBooksClick}
            className={`text-left px-3 py-1 rounded ${active === 'mybooks' ? 'bg-blue-500 text-white' : 'hover:text-blue-400'}`}
          >
            My Books
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
