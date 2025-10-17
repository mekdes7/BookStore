import { useState, useEffect } from "react";
import API, { setAuthHeader } from "../../services/api.js";


export default function AddBook({ goBack, onBookAdded, editingBook }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) setAuthHeader(token);
  }, [token]);

  const [title, setTitle] = useState(editingBook?.title || "");
  const [year, setYear] = useState(
    editingBook?.published_year
      ? new Date(editingBook.published_year).toISOString().split("T")[0]
      : ""
  );
  const [category, setCategory] = useState(editingBook?.category || "");
  const [description, setDescription] = useState(editingBook?.description || "");
  const [cover, setCover] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("published_year", year);
      formData.append("category", category);
      formData.append("description", description);
      if (cover) formData.append("cover", cover);
      if (file) formData.append("file", file);

      let response;

      if (editingBook) {
       
        response = await API.put(`/books/${editingBook.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
      
        response = await API.post("/books/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      alert(editingBook ? "Book updated successfully!" : "Book added successfully!");
      if (onBookAdded) onBookAdded(response.data.book);
      goBack();
    } catch (err) {
      console.error("Book save error:", err);
      alert(err.response?.data?.message || "Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-auto p-2 bg-opacity-95">
      <form
        onSubmit={submit}
        className="bg-white shadow-md rounded-xl px-4 pt-4 pb-6 w-full max-w-sm"
      >
        <h2 className="text-lg font-bold mb-3 text-center">
          {editingBook ? "Edit Book" : "Add New Book"}
        </h2>

        <label className="block text-sm font-medium mb-1">Book's Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-2 py-1 border rounded mb-3 text-sm"
        />

        <label className="block text-sm font-medium mb-1">Published Year</label>
        <input
          type="date"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="w-full px-2 py-1 border rounded mb-3 text-sm"
        />

        <label className="block text-sm font-medium mb-1">Book's Cover</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCover(e.target.files[0])}
          className="w-full px-2 py-1 border rounded mb-3 text-sm"
        />

        <label className="block text-sm font-medium mb-1">Book File (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full px-2 py-1 border rounded mb-3 text-sm"
        />

        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-2 py-1 border rounded mb-3 text-sm"
        >
          <option value="">Select Category</option>
          <option value="self-help">Self-help</option>
          <option value="business">Business</option>
          <option value="kids">Kids</option>
          <option value="fiction">Fiction</option>
          <option value="history">History</option>
        </select>

        <label className="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-4 text-sm"
        />

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white text-sm px-3 py-1 rounded transition`}
          >
            {loading
              ? editingBook
                ? "Updating..."
                : "Uploading..."
              : editingBook
              ? "Update"
              : "Submit"}
          </button>
          <button
            type="button"
            onClick={goBack}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

