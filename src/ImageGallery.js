// src/ImageGallery.js
import React, { useState } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: searchTerm, per_page: 9 },
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
        },
      });
      setImages(response.data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchImages();
  };

  const handleSelectImage = (image) => {
    const isImageSelected = selectedImages.includes(image);
    if (isImageSelected) {
      setSelectedImages(selectedImages.filter(selectedImage => selectedImage.id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('selectedImages', JSON.stringify(selectedImages));
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for images"
        />
        <button type="submit">Search</button>
      </form>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.map((image) => {
          // Extract the base URL up to the query parameters
          const baseUrl = image.urls.regular.split('?')[0];
          
          // Specify your desired dimensions
          const width = 1080; // Adjust width as needed
          const queryParams = `?w=${width}&q=80&fit=max`; // Adjust query parameters as needed
          
          // Reconstruct the URL with the new parameters
          const customUrl = `${baseUrl}${queryParams}`;

          return (
            <img
              key={image.id}
              src={customUrl}
              alt={image.alt_description}
              style={{ width: '320px', height: '180px', objectFit: 'cover', cursor: 'pointer', border: selectedImages.includes(image) ? '2px solid blue' : 'none' }}
              onClick={() => handleSelectImage(image)}
            />
          );
        })}
      </div>
      <button onClick={saveToLocalStorage} disabled={selectedImages.length === 0}>Save Selected</button>
    </div>
  );
};

export default ImageGallery;
