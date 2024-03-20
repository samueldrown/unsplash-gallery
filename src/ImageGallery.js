// src/ImageGallery.js
import React, { useState } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const fetchImages = async () => {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: { query: searchTerm, per_page: 9 },
      headers: {
        Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
      },
    });
    setImages(response.data.results);
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
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer', border: selectedImages.includes(image) ? '2px solid blue' : 'none' }}
            onClick={() => handleSelectImage(image)}
          />
        ))}
      </div>
      <button onClick={saveToLocalStorage} disabled={selectedImages.length === 0}>Save Selected</button>
    </div>
  );
};

export default ImageGallery;
