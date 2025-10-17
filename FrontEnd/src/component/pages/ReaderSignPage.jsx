import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API from '../../services/api.js';  

const ReaderSignPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    category: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/readers/register", {
  first_name: formData.firstName,
  last_name: formData.lastName,
  email: formData.email,
  password: formData.password,
  favorite_category: formData.category,
});


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("readerUser", JSON.stringify(res.data.user));

      alert("Reader account created!");
      navigate("/login/reader"); 
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full relative overflow-hidden">
     
      <div
        className="w-full lg:w-1/2 relative bg-cover bg-center h-[300px] lg:h-auto z-10"
        style={{ backgroundImage: "url('/bookbg.jpg')" }}
      >
        <div
          className="absolute top-4 left-4 cursor-pointer z-20"
          onClick={() => navigate('/')}
        >
          <img src="/leftarrow.png" alt="Back" className="w-8 h-8" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-white text-center z-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">
            Welcome to online <br /> 
            <span className="text-3xl lg:text-4xl">Book Store</span>
          </h2>
          <p className="text-lg italic">“Open a Book<br />Grow your mind”</p>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-900 py-10 px-4 relative z-20">
        <div className="relative bg-black/70 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-xl w-full max-w-md -ml-5 lg:-ml-16">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-white font-semibold">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-full"
                required
              />
              {formData.firstName && !nameRegex.test(formData.firstName) && (
                <p className="text-red-500 text-sm">
                  First name must be 2–50 letters.
                </p>
              )}
            </div>
            <div>
              <label className="block text-white font-semibold">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-full"
                required
              />
              {formData.lastName && !nameRegex.test(formData.lastName) && (
                <p className="text-red-500 text-sm">
                  Last name must be 2–50 letters.
                </p>
              )}
            </div>
            <div>
              <label className="block text-white font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-full"
                required
              />
              {formData.email && !emailRegex.test(formData.email) && (
                <p className="text-red-500 text-sm">Invalid email address.</p>
              )}
            </div>
            <div>
              <label className="block text-white font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-full"
                required
              />
              {formData.password && !passwordRegex.test(formData.password) && (
                <p className="text-red-500 text-sm">
                  Password must be 8+ chars, include upper, lower, number & special char.
                </p>
              )}
            </div>
            <div>
              <label className="block text-white font-semibold">Favorite Categories</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-full"
                required
              >
                <option value="">Select a Category</option>
                <option value="self-help">Self-help</option>
                <option value="business">Business</option>
                <option value="kids">Kids</option>
                <option value="fiction">Fiction</option>
                <option value="history">History</option>
              </select>
            </div>

            <p className="text-sm text-gray-200 mt-2">
              Already have an account?{" "}
              <Link to="/login/reader" className="text-amber-400 underline hover:text-amber-500">
                Login
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-6 py-2 text-lg mt-4"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReaderSignPage;
