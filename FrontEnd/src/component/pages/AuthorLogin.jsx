import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function AuthorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!emailRegex.test(formData.email)) {
    alert("Please enter a valid email address");
    return;
  }
  
  if (!passwordRegex.test(formData.password)) {
    alert("Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character");
    return;
  }
  
  setLoading(true);

  try {
    console.log("Attempting login with:", formData.email);
    const res = await API.post("http://localhost:5000/api/authors/login", formData);

    console.log("Login successful - Full response:", res.data);
    console.log("Token received:", res.data.token ? "YES" : "NO");
    console.log("Author data received:", res.data.author);
    console.log("Author firstName:", res.data.author?.firstName);
    console.log("Author first_name:", res.data.author?.first_name);

    if (res.data.token && res.data.author) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("authorUser", JSON.stringify(res.data.author)); 
      
      console.log("Verifying localStorage...");
      console.log("Saved token:", localStorage.getItem("token"));
      console.log("Saved authorUser:", localStorage.getItem("authorUser"));
      
      console.log("Navigating to dashboard...");
      navigate("/dashboard/author");
    } else {
      alert("Login failed: No token received");
    }
  } catch (error) {
    console.error("Login error details:", error);
    
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      
      if (error.response.status === 400) {
        alert("Invalid email or password. Please check your credentials.");
      } else {
        alert(`Login failed: ${error.response.data?.message || 'Server error'}`);
      }
    } else if (error.request) {
      alert("Network error: Cannot connect to server");
    } else {
      alert(`Request error: ${error.message}`);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bookbg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div
        className="absolute top-4 left-3 z-20 cursor-pointer p-2 bg-opacity-20 backdrop-blur-sm hover:bg-opacity-40 transition"
        onClick={() => navigate("/")}
      >
        <img src="/leftarrow.png" alt="Back" className="w-8 h-8" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Author Login
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              autoComplete="email"
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
              autoComplete="current-password"
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
          >
            Login
          </button>
          <p className="text-sm mt-2 text-center">
            Don’t have an account?{' '}
            <a href="/signup/author" className="text-blue-400 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
