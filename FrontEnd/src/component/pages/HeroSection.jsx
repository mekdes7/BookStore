import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const signInRef = useRef(null);
  const loginRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        signInRef.current &&
        !signInRef.current.contains(event.target) &&
        loginRef.current &&
        !loginRef.current.contains(event.target)
      ) {
        setShowSignIn(false);
        setShowLogin(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
     
      <div className="relative mt-35 mx-auto max-w-md px-4 w-full">
        <input
          type="text"
          placeholder="Search for books"
          className="pl-10 w-full py-2 bg-gray-200 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <div className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </div>
      </div>

      <div className="relative mt-10 w-full h-[400px] sm:h-[500px]">
        <div className="relative w-full h-full">
          <img src="/woman-bookshelf.jpg" alt="get a book" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-70" />

        
          <div className="absolute inset-0 bottom-50 flex items-center justify-start px-6 sm:px-16 mt-10 sm:mt-20 text-white text-2xl sm:text-4xl font-semibold z-10">
            <p>
              "Today a Reader,<br className="hidden sm:block" /> Tomorrow a Leader!"
            </p>
          </div>

      
          <div className="absolute bottom-28 left-1/2 sm:left-auto sm:right-10 transform -translate-x-1/2 sm:translate-x-0 flex flex-col sm:flex-row gap-4 z-10">
        
            <div className="relative" ref={signInRef}>
              <button
                onClick={() => {
                  setShowSignIn((prev) => !prev);
                  setShowLogin(false);
                }}
                className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-blue-400 hover:text-white transition w-[180px]"
              >
                Sign Up
              </button>
              <AnimatePresence>
                {showSignIn && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 sm:left-auto sm:right-0 flex flex-col bg-white text-black shadow-md rounded-md top-full mt-2 w-44 z-50"
                  >

                    <Link to="/signup/reader" className="px-4 py-2 hover:bg-blue-100">Sign up as Reader</Link>
                    <Link to="/signup/author" className="px-4 py-2 hover:bg-blue-100">Sign up as Author</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          
            <div className="relative" ref={loginRef}>
              <button
                onClick={() => {
                  setShowLogin((prev) => !prev);
                  setShowSignIn(false);
                }}
                className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-blue-400 hover:text-white transition w-[180px]"
              >
                Login
              </button>
              <AnimatePresence>
                {showLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 sm:left-auto sm:right-0 flex flex-col bg-white text-black shadow-md rounded-md top-full mt-2 w-44 z-50"
                  >

                    <Link to="/login/reader" className="px-4 py-2 hover:bg-blue-100">Login as Reader</Link>
                    <Link to="/login/author" className="px-4 py-2 hover:bg-blue-100">Login as Author</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
