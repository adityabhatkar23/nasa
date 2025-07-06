import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const EPIC = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const apiKey = localStorage.getItem('apiKey');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Fetch images for selected date
  useEffect(() => {
    if (selectedDate && apiKey) {
      fetchImages(selectedDate);
      setCurrentImageIndex(0); 
    }
  }, [selectedDate, apiKey]);

  const fetchImages = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError('Failed to fetch EPIC images: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (image) => {
    const date = new Date(image.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `https://api.nasa.gov/EPIC/archive/natural/${year}/${month}/${day}/png/${image.image}.png?api_key=${apiKey}`;
  };

  const goToNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="bg-neutral-950 h-full w-full lg:p-6 p-3 mt-16 lg:mt-0 rounded-2xl flex flex-col gap-4">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-zinc-200 mb-4">EPIC Earth Imagery</h1>
        <p className="text-zinc-400 mb-6">
          View stunning images of Earth from NASA's EPIC (Earth Polychromatic Imaging Camera) 
          aboard the DSCOVR satellite, positioned between Earth and the Sun.
        </p>

        <div className="mb-6">
          <label className="text-zinc-300 font-medium mb-2 block">Select Date</label>
          <input
            type="date"
            className="bg-zinc-800 border border-zinc-600 text-white rounded-lg px-3 py-2 w-full max-w-xs"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {loading && <Loading message="Loading EPIC Images..." />}
        {error && <ErrorMessage title="Error loading EPIC Images" error={error} onRetry={fetchImages} />}
        
        {!loading && !error && images.length === 0 && (
          <div className="text-zinc-400 text-center mt-8">
            No images available for the selected date.
          </div>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="space-y-6">
            <div className="text-zinc-300 mb-4">
              <p className="text-lg font-semibold">
                {formatDate(selectedDate)} - {images.length} image{images.length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            <div className="bg-neutral-900 rounded-lg overflow-hidden">
              <div className="relative flex flex-col items-center top-4">
                <img
                  src={getImageUrl(images[currentImageIndex])}
                  alt={`EPIC Earth Image ${currentImageIndex + 1}`}
                  className="w-3xl  object-cover object-center rounded-lg"
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-sm px-3 py-2 rounded">
                  {new Date(images[currentImageIndex].date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-zinc-200">
                    Earth from Space
                  </h3>
                  <div className="text-zinc-400 text-sm">
                    {currentImageIndex + 1} of {images.length}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-400 mb-6">
                  <div>
                    <p><span className="font-medium text-zinc-300">Date:</span> {formatDate(images[currentImageIndex].date)}</p>
                    <p><span className="font-medium text-zinc-300">Time:</span> {new Date(images[currentImageIndex].date).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p><span className="font-medium text-zinc-300">Caption:</span> {images[currentImageIndex].caption}</p>
                    <p><span className="font-medium text-zinc-300">Version:</span> {images[currentImageIndex].version}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <a
                    href={getImageUrl(images[currentImageIndex])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline font-medium"
                  >
                    View Full Resolution
                  </a>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={goToPreviousImage}
                      disabled={currentImageIndex === 0}
                      className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={goToNextImage}
                      disabled={currentImageIndex === images.length - 1}
                      className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EPIC; 