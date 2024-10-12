import React, { useState, useEffect } from "react";

const ImageUpload = () => {
  const [images, setImages] = useState([]);
  const [retrievedImages, setRetrievedImages] = useState([]);

  const handleImageChange = (e) => {
    setImages(e.target.files); // Get all selected files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Append each image to the FormData object
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    // Send a POST request to upload the images to the backend using fetch
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setRetrievedImages(result.uploadedImages);
      console.log("Images uploaded:", result);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  useEffect(() => {
    retrieveImages();
  }, [images]);

  const retrieveImages = async () => {
    try {
      const resp = await fetch("http://localhost:5000/images");
      const imagesData = await resp.json();
      setRetrievedImages(imagesData.images);
      console.log("Images retrieved:", imagesData);
    } catch (error) {
      console.error("Error retrieving images:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      <div>
        {retrievedImages.length !== 0 ? (
          retrievedImages.map((image) => (
            <img
              key={image.id}
              src={`http://localhost:5000/${image.filepath}`}
              alt={image.filename}
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          ))
        ) : (
          <h1>No Images Uploaded Yet</h1>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
