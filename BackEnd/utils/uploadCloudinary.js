export const uploadToCloudinary = async (file, resourceType = "image") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "BookStore"); 

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dfvehlmev/${resourceType}/upload`, 
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url; 
    } else {
      throw new Error(data.error?.message || "Upload failed");
    }
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};
