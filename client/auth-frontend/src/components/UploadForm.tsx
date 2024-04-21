import React, { useState } from "react";
const UploadForm: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      console.error("No image selected");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:3000/api/sign", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Image signed successfully");
      } else {
        console.error("Failed to sign image");
      }
    } catch (error) {
      console.error("Error signing image: ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          accept="image/*"
          name="uploaded_image"
          onChange={handleFileChange}
        />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};

export default UploadForm;
