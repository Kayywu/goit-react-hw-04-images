import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import Api from './Api/Api';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [largeImageUrl, setLargeImageUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const newImages = await Api.fetchImages(query, page);
        setImages((prevImages) => [...prevImages, ...newImages]);
      } catch (error) {
        console.error('Error', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [query, page]);

  const handleSubmit = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    setIsLoading(true);
  };

  const openModal = (imageUrl, alt) => {
    setLargeImageUrl(imageUrl);
    setAlt(alt);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery>
        {images.map(({ id, webformatURL, largeImageURL, tags }) => (
          <ImageGalleryItem
            key={id}
            imageUrl={webformatURL}
            alt={tags}
            onClick={() => openModal(largeImageURL, tags)}
          />
        ))}
      </ImageGallery>
      {isLoading && <h2>Loading...</h2>}
      {images.length > 0 && !isLoading && <Button onClick={handleLoadMore} />}
      {showModal && (
        <Modal largeImageUrl={largeImageUrl} alt={alt} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;
