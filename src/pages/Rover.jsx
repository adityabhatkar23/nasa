import React, { useState } from 'react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

const ROVERS = [
  { name: 'Curiosity', cameras: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'] },
  { name: 'Opportunity', cameras: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'] },
  { name: 'Spirit', cameras: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'] },
];

const ITEMS_PER_PAGE = 12;

const CAMERA_FULL_NAMES = {
  FHAZ: 'Front Hazard Avoidance Camera',
  RHAZ: 'Rear Hazard Avoidance Camera',
  MAST: 'Mast Camera',
  CHEMCAM: 'Chemistry and Camera Complex',
  MAHLI: 'Mars Hand Lens Imager',
  MARDI: 'Mars Descent Imager',
  NAVCAM: 'Navigation Camera',
  PANCAM: 'Panoramic Camera',
  MINITES: 'Miniature Thermal Emission Spectrometer',
};

const Rover = () => {
  const [rover, setRover] = useState('Curiosity');
  const [sol, setSol] = useState(1000);
  const [camera, setCamera] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const apiKey = localStorage.getItem('apiKey');

  const fetchPhotos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPhotos([]);
    setCurrentPage(1);
    try {
      let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover.toLowerCase()}/photos?sol=${sol}`;
      if (camera) url += `&camera=${camera}`;
      url += `&api_key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(photos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPhotos = photos.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-neutral-950 h-full w-full lg:p-6 p-3 mt-16 lg:mt-0 rounded-2xl flex flex-col gap-4 lg:flex-row">
      <div className="w-full ">
        <h1 className="text-2xl font-bold text-zinc-200 mb-4">Mars Rover Photos</h1>
        <form onSubmit={fetchPhotos} className="flex flex-wrap gap-4 mb-6 items-end">
          <div className="flex flex-col">
            <label className="text-zinc-300 font-medium mb-1">Rover</label>
            <select
              className="bg-zinc-800 border border-zinc-600 text-white rounded-lg px-3 py-2"
              value={rover}
              onChange={e => { setRover(e.target.value); setCamera(''); }}
            >
              {ROVERS.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-zinc-300 font-medium mb-1">Sol (Martian day)</label>
            <input
              className="bg-zinc-800 border border-zinc-600 text-white rounded-lg px-3 py-2"
              type="number"
              min={0}
              value={sol}
              onChange={e => setSol(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-zinc-300 font-medium mb-1">Camera</label>
            <select
              className="bg-zinc-800 border border-zinc-600 text-white rounded-lg px-3 py-2"
              value={camera}
              onChange={e => setCamera(e.target.value)}
            >
              <option value="">All</option>
              {ROVERS.find(r => r.name === rover).cameras.map(cam => (
                <option key={cam} value={cam}>
                  {cam} - {CAMERA_FULL_NAMES[cam] || cam}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-zinc-800 px-6 py-2 rounded-lg font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Photos'}
          </button>
        </form>
        {loading && <Loading message="Loading Rover Photos..." />}
        {error && <ErrorMessage title="Error loading Rover Photos" error={error} onRetry={fetchPhotos} />}
        {!loading && !error && photos.length === 0 && (
          <div className="text-zinc-400 text-center mt-8">No photos found for the selected criteria.</div>
        )}
        {!loading && !error && photos.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentPhotos.map(photo => (
                <div key={photo.id} className="bg-neutral-900 rounded-lg overflow-hidden flex flex-col">
                  <img
                    src={photo.img_src}
                    alt={`Mars Rover ${rover} - ${photo.camera.full_name}`}
                    className="w-full h-48 object-cover object-center"
                  />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-base text-zinc-200 mb-1">{photo.camera.full_name}</h3>
                      <p className="text-sm text-zinc-400 mb-1">Sol: {photo.sol}</p>
                      <p className="text-xs text-zinc-500">Earth Date: {photo.earth_date}</p>
                    </div>
                    <a
                      href={photo.img_src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-blue-400 hover:underline text-sm"
                    >
                      View Full Image
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              goToPage={goToPage}
              goToPreviousPage={goToPreviousPage}
              goToNextPage={goToNextPage}
              getPageNumbers={getPageNumbers}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Rover;