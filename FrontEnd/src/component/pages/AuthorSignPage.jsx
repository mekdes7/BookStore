import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api.js"; 

export default function AuthorSignPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  const validateForm = () => {
    const newErrors = {};

    if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = "First name must be 2-50 letters";
    }

    if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Last name must be 2-50 letters";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be 8+ chars, include upper, lower, number & special char";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
     const res = await API.post("/authors/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
       
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("authorUser", JSON.stringify(res.data.author || res.data.user));
        
        alert("Author registered successfully!");
        navigate("/login/author");
      } else {
        alert("Registration successful! Please login.");
        navigate("/login/author");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to register. Please try again.";
      setErrors({ submit: errorMessage });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full relative overflow-hidden">
      <div
        className="w-full lg:w-1/2 relative bg-cover bg-center h-[300px] lg:h-auto z-10"
        style={{ backgroundImage: "url('/bookbg.jpg')" }}
      >
        <div
          className="absolute top-4 left-4 cursor-pointer z-20"
          onClick={() => navigate("/")}
        >
          <img src="/leftarrow.png" alt="Back" className="w-8 h-8" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-white text-center z-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">
            Welcome to online <br />{" "}
            <span className="text-3xl lg:text-4xl">Book Store</span>
          </h2>
          <p className="text-sm lg:text-lg italic">
            "If you don't see the book you want on the shelf, <br /> write it!"
          </p>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-900 py-10 px-4 relative z-20">
        <div className="relative bg-black/70 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-xl w-full max-w-md -ml-5 lg:-ml-16">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">First Name</label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                required
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Last Name</label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                required
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                required
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                required
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <p className="text-sm text-gray-200 mt-2 text-center">
              Already have an account?{" "}
              <Link
                to="/login/author"
                className="text-amber-400 underline hover:text-amber-500 font-semibold"
              >
                Login here
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-white rounded-lg px-6 py-3 text-lg font-semibold mt-4 transition-colors duration-200"
            >
              {loading ? "Creating Account..." : "Create Author Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}