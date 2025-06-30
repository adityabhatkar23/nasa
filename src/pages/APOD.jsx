import React, { useState, useEffect } from "react";
import { formatDate } from '../utils';
import Pagination from '../components/Pagination';
import DateRangeForm from '../components/DateRangeForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SectionHeader from '../components/SectionHeader';

const APOD = () => {
  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [apodData, setApodData] = useState(null);
  const [apodRange, setApodRange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState({});
  const [viewMode, setViewMode] = useState("single");
  

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const apiKey = localStorage.getItem("apiKey");

  const fetchAPOD = async (date = null, start = null, end = null) => {
    setLoading(true);
    setError(null);
    setCurrentPage(1); 
    
    try {
      let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
      
      if (date) {
        url += `&date=${date}`;
        setViewMode("single");
      } else if (start && end) {
        url += `&start_date=${start}&end_date=${end}`;
        setViewMode("range");
      } else {
        const today = new Date().toISOString().split('T')[0];
        url += `&date=${today}`;
        setViewMode("single");
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setApodRange(data);
        setApodData(null);
      } else {
        setApodData(data);
        setApodRange([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching APOD:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (specificDate) {
      fetchAPOD(specificDate);
    } else if (startDate && endDate) {
      fetchAPOD(null, startDate, endDate);
    } else {
      fetchAPOD(); 
    }
  };

  const toggleDescription = (index) => {
    setShowFullDescription(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };


  const totalPages = Math.ceil(apodRange.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApods = apodRange.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };


  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const renderSingleAPOD = () => (
    <div className="bg-neutral-900 p-3 lg:p-6 w-full lg:w-3/4 rounded-lg space-y-4">
      <h1 className="text-2xl font-bold text-zinc-200">{apodData?.title || "Astronomy Picture of the Day"}</h1>
      <p className="text-lg font-light text-zinc-300">
        Date: {formatDate(apodData?.date)}
      </p>
      
      {apodData?.media_type === 'image' ? (
        <div className="w-full pt-4 rounded-lg overflow-hidden">
          <img
            className="w-full object-cover object-center rounded-lg"
            src={apodData?.url}
            alt={apodData?.title}
          />
        </div>
      ) : apodData?.media_type === 'video' ? (
        <div className="w-full pt-4 rounded-lg overflow-hidden">
          <iframe
            className="w-full h-96 rounded-lg"
            src={apodData?.url}
            title={apodData?.title}
            allowFullScreen
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-lg text-zinc-300">
          {showFullDescription[0] 
            ? apodData?.explanation 
            : apodData?.explanation?.substring(0, 200) + "..."}
        </p>
        
        {apodData?.explanation && apodData.explanation.length > 200 && (
          <button 
            onClick={() => toggleDescription(0)}
            className="cursor-pointer border border-zinc-600 p-2 rounded-lg text-zinc-300 font-medium hover:bg-zinc-800 transition-colors"
          >
            {showFullDescription[0] ? "Show less" : "Read more"}
          </button>
        )}
        
        <div className="flex items-center justify-between">
          {apodData?.copyright && (
            <p className="text-sm text-zinc-400">
              © {apodData.copyright}
            </p>
          )}
          <a
            className="hover:underline text-zinc-300 hover:text-white transition-colors"
            href={apodData?.hdurl || apodData?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Full Resolution {apodData?.media_type === 'video' ? 'Video' : 'Image'}
          </a>
        </div>
      </div>
    </div>
  );

  const renderRangeAPOD = () => (
    <div className="w-full lg:w-3/4 space-y-4">
      <SectionHeader
        title="APOD Collection"
        count={`${apodRange.length} images from ${formatDate(startDate)} to ${formatDate(endDate)}`}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={Math.min(endIndex, apodRange.length)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentApods.map((apod, index) => {
          const globalIndex = startIndex + index;
          return (
            <div key={globalIndex} className="bg-neutral-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                {apod.media_type === 'image' ? (
                  <img
                    className="w-full h-full object-cover"
                    src={apod.url}
                    alt={apod.title}
                  />
                ) : apod.media_type === 'video' ? (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-400">🎥 Video</span>
                  </div>
                ) : null}
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2 mb-1 text-zinc-200">
                    {apod.title}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {formatDate(apod.date)}
                  </p>
                </div>
                
                <p className="text-zinc-300 text-sm">
                  {showFullDescription[globalIndex] 
                    ? apod.explanation 
                    : apod.explanation?.substring(0, 100) + "..."}
                </p>
                
                {apod.explanation && apod.explanation.length > 100 && (
                  <button 
                    onClick={() => toggleDescription(globalIndex)}
                    className="text-zinc-400 hover:text-zinc-300 text-sm font-medium cursor-pointer transition-colors"
                  >
                    {showFullDescription[globalIndex] ? "Show less" : "Read more"}
                  </button>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  {apod.copyright && (
                    <p className="text-xs text-zinc-500">
                      © {apod.copyright}
                    </p>
                  )}
                  <a
                    className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors"
                    href={apod.hdurl || apod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Full
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        goToPage={goToPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        getPageNumbers={getPageNumbers}
      />
    </div>
  );

  if (loading) {
    return <Loading message="Loading APOD..." />;
  }

  if (error) {
    return (
      <div className="bg-neutral-950 h-full w-full lg:p-6 p-3 mt-16 lg:mt-0 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading APOD...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-950 h-full w-full lg:p-6 p-3 mt-16 lg:mt-0 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Error loading APOD</p>
          <p className="text-zinc-300 mb-4">{error}</p>
          <button 
            onClick={() => fetchAPOD()}
            className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 h-full w-full lg:p-6 p-3 mt-16 lg:mt-0 rounded-2xl flex flex-col gap-4 lg:flex-row">
      {viewMode === "single" ? renderSingleAPOD() : renderRangeAPOD()}

      <div className="bg-neutral-900 p-3 lg:p-6 w-full lg:w-1/4 rounded-lg space-y-4">
        <h1 className="text-2xl font-bold text-zinc-200">APOD Options</h1>
        
        <DateRangeForm
          specificDate={specificDate}
          startDate={startDate}
          endDate={endDate}
          onSpecificDateChange={e => { setSpecificDate(e.target.value); setStartDate(""); setEndDate(""); }}
          onStartDateChange={e => { setStartDate(e.target.value); setSpecificDate(""); }}
          onEndDateChange={e => { setEndDate(e.target.value); setSpecificDate(""); }}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Fetch APOD"
        />
        
        <div className="pt-4 border-t border-zinc-700">
          <button 
            onClick={() => fetchAPOD()}
            className="bg-zinc-700 w-full py-2 rounded-lg cursor-pointer font-medium hover:bg-zinc-600 transition-colors text-zinc-200"
          >
            Today's APOD
          </button>
        </div>
      </div>
    </div>
  );
};

export default APOD;
