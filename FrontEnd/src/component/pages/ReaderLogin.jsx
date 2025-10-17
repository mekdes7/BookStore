import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api.js';

const ReaderLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    console.log("Logging in with:", formData);
  
    try {
      const res = await API.post("/readers/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response:", res.data); 

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("readerUser", JSON.stringify(res.data.reader)); 

      alert("Login successful!");
      navigate("/dashboard/reader");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bookbg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div
        className="absolute top-4 left-3 z-20 cursor-pointer p-2 bg-opacity-20 backdrop-blur-sm hover:bg-opacity-40 transition"
        onClick={() => navigate('/')}
      >
        <img src="/leftarrow.png" alt="Back" className="w-8 h-8" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">Reader Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formData.email && !emailRegex.test(formData.email) && (
              <p className="text-red-500 text-sm">
                Please enter a valid email address.
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="......"
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 font-extrabold focus:ring-blue-400"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formData.password && !passwordRegex.test(formData.password) && (
              <p className="text-red-500 text-sm">
                Password must be at least 8 characters long, contain at least
                one uppercase letter, one lowercase letter, one number, and one
                special character.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-sm mt-2 text-center">
            Don't have an account?{' '}
            <a href="/signup/reader" className="text-blue-400 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ReaderLogin;