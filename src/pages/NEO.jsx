import React, { useState, useEffect } from "react";
import { formatDate } from '../utils';
import Pagination from '../components/Pagination';
import DateRangeForm from '../components/DateRangeForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SectionHeader from '../components/SectionHeader';

const NEO = () => {
  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [neoFeedData, setNeoFeedData] = useState(null);
  const [neoObjects, setNeoObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNEO, setSelectedNEO] = useState(null);
  const [expandedDates, setExpandedDates] = useState({});
  const itemsPerDatePage = 3;

  const apiKey = localStorage.getItem("apiKey");

  const fetchNEO = async (date = null, start = null, end = null) => {
    setLoading(true);
    setError(null);
    setCurrentPage(1); 
    try {
      let url = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${apiKey}`;
      if (date) {
        url += `&start_date=${date}&end_date=${date}`;
      } else if (start && end) {
        url += `&start_date=${start}&end_date=${end}`;
      } else {
        const today = new Date().toISOString().split('T')[0];
        url += `&start_date=${today}&end_date=${today}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error_message || `HTTP error! status: ${response.status}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNeoFeedData(data);
      if (data.near_earth_objects) {
        const allNeos = Object.values(data.near_earth_objects).flat();
        setNeoObjects(allNeos);
      } else {
        setNeoObjects([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching NEO:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNEO();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (specificDate) {
      fetchNEO(specificDate);
    } else if (startDate && endDate) {
      fetchNEO(null, startDate, endDate);
    } else {
      fetchNEO(); 
    }
  };

  // Group NEOs by date
  const groupNeosByDate = () => {
    if (!neoFeedData || !neoFeedData.near_earth_objects) return {};
    return neoFeedData.near_earth_objects;
  };
  const groupedNeos = groupNeosByDate();
  const dateKeys = Object.keys(groupedNeos).sort((a, b) => new Date(b) - new Date(a));

  // Pagination for dates
  const totalPages = Math.ceil(dateKeys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDateKeys = dateKeys.slice(startIndex, endIndex);

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

  const openModal = (neo) => {
    setSelectedNEO(neo);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedNEO(null);
    setModalOpen(false);
  };

  const handleShowMore = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: { expanded: true, page: 1 }
    }));
  };
  const handleShowLess = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: { expanded: false, page: 1 }
    }));
  };
  const handleDatePageChange = (date, page) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: { ...prev[date], page }
    }));
  };

  const renderNeoList = () => (
    <div className="w-full space-y-4">
      <SectionHeader
        title="Near Earth Objects"
        count={`${neoObjects.length} objects found`}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={Math.min(endIndex, dateKeys.length)}
      />
      <div className="space-y-8">
        {currentDateKeys.map(date => {
          const neos = groupedNeos[date];
          const expanded = expandedDates[date]?.expanded;
          const page = expandedDates[date]?.page || 1;
          const totalExtra = neos.length - itemsPerDatePage;
          const totalPagesForDate = Math.ceil(totalExtra / itemsPerDatePage);
          const startIdx = itemsPerDatePage + (page - 1) * itemsPerDatePage;
          const endIdx = startIdx + itemsPerDatePage;
          return (
            <div key={date} className="bg-neutral-900 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-zinc-100 mb-2">{formatDate(date)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {neos.slice(0, itemsPerDatePage).map((neo) => {
                  const diameter = neo.estimated_diameter.kilometers;
                  return (
                    <div key={neo.id} className="bg-neutral-800 rounded-lg p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-base line-clamp-2 mb-1 text-zinc-200">{neo.name}</h3>
                        <p className={`text-sm ${neo.is_potentially_hazardous_asteroid ? 'text-red-400' : 'text-green-400'}`}>{neo.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Not Hazardous'}</p>
                      </div>
                      <div className="text-zinc-300 text-sm space-y-2 my-4">
                        <p><strong>Close Approach:</strong> {neo.close_approach_data[0]?.close_approach_date_full}</p>
                        <p><strong>Diameter (km):</strong> {parseFloat(diameter.estimated_diameter_min).toFixed(3)} - {parseFloat(diameter.estimated_diameter_max).toFixed(3)}</p>
                        <p><strong>Velocity (km/s):</strong> {parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_second).toFixed(2)}</p>
                        <p><strong>Miss Distance (km):</strong> {parseInt(neo.close_approach_data[0]?.miss_distance.kilometers).toLocaleString()}</p>
                      </div>
                      <button
                        className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors mt-auto w-full bg-zinc-700 hover:bg-zinc-600 rounded py-2 font-medium"
                        onClick={() => openModal(neo)}
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
                {expanded && neos.length > itemsPerDatePage && neos.slice(startIdx, endIdx).map((neo) => {
                  const diameter = neo.estimated_diameter.kilometers;
                  return (
                    <div key={neo.id} className="bg-neutral-800 rounded-lg p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-base line-clamp-2 mb-1 text-zinc-200">{neo.name}</h3>
                        <p className={`text-sm ${neo.is_potentially_hazardous_asteroid ? 'text-red-400' : 'text-green-400'}`}>{neo.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Not Hazardous'}</p>
                      </div>
                      <div className="text-zinc-300 text-sm space-y-2 my-4">
                        <p><strong>Close Approach:</strong> {neo.close_approach_data[0]?.close_approach_date_full}</p>
                        <p><strong>Diameter (km):</strong> {parseFloat(diameter.estimated_diameter_min).toFixed(3)} - {parseFloat(diameter.estimated_diameter_max).toFixed(3)}</p>
                        <p><strong>Velocity (km/s):</strong> {parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_second).toFixed(2)}</p>
                        <p><strong>Miss Distance (km):</strong> {parseInt(neo.close_approach_data[0]?.miss_distance.kilometers).toLocaleString()}</p>
                      </div>
                      <button
                        className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors mt-auto w-full bg-zinc-700 hover:bg-zinc-600 rounded py-2 font-medium"
                        onClick={() => openModal(neo)}
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
              {neos.length > itemsPerDatePage && !expanded && (
                <button
                  className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
                  onClick={() => handleShowMore(date)}
                >
                  Show more ({neos.length - itemsPerDatePage} more)
                </button>
              )}
              {expanded && neos.length > itemsPerDatePage && (
                <div className="flex flex-col items-center mt-4 space-y-2">
                  <Pagination
                    totalPages={totalPagesForDate}
                    currentPage={page}
                    goToPage={p => handleDatePageChange(date, p)}
                    goToPreviousPage={() => handleDatePageChange(date, Math.max(1, page - 1))}
                    goToNextPage={() => handleDatePageChange(date, Math.min(totalPagesForDate, page + 1))}
                    getPageNumbers={() => {
                      const pages = [];
                      const maxVisiblePages = 5;
                      if (totalPagesForDate <= maxVisiblePages) {
                        for (let i = 1; i <= totalPagesForDate; i++) pages.push(i);
                      } else {
                        if (page <= 3) {
                          for (let i = 1; i <= 4; i++) pages.push(i);
                          pages.push('...');
                          pages.push(totalPagesForDate);
                        } else if (page >= totalPagesForDate - 2) {
                          pages.push(1);
                          pages.push('...');
                          for (let i = totalPagesForDate - 3; i <= totalPagesForDate; i++) pages.push(i);
                        } else {
                          pages.push(1);
                          pages.push('...');
                          for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                          pages.push('...');
                          pages.push(totalPagesForDate);
                        }
                      }
                      return pages;
                    }}
                  />
                  <button
                    className="text-blue-400 hover:text-blue-300 font-medium"
                    onClick={() => handleShowLess(date)}
                  >
                    Show less
                  </button>
                </div>
              )}
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

  const renderModal = () => {
    if (!modalOpen || !selectedNEO) return null;
    const diameter = selectedNEO.estimated_diameter.kilometers;
    const approach = selectedNEO.close_approach_data[0] || {};
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-neutral-900 rounded-lg p-6 max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
          <button
            className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-200 text-xl font-bold"
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-xl font-bold text-zinc-100 mb-4">{selectedNEO.name}</h2>
          <div className="text-zinc-300 text-sm space-y-2">
            <div className="mb-2">
              <span className="font-semibold">ID:</span> {selectedNEO.id}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Potentially Hazardous:</span> {selectedNEO.is_potentially_hazardous_asteroid ? (
                <span className="text-red-400 font-semibold ml-1">Yes</span>
              ) : (
                <span className="text-green-400 font-semibold ml-1">No</span>
              )}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Estimated Diameter (km):</span> {parseFloat(diameter.estimated_diameter_min).toFixed(3)} - {parseFloat(diameter.estimated_diameter_max).toFixed(3)}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Absolute Magnitude H:</span> {selectedNEO.absolute_magnitude_h}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Close Approach Date:</span> {approach.close_approach_date_full || approach.close_approach_date}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Relative Velocity (km/s):</span> {approach.relative_velocity ? parseFloat(approach.relative_velocity.kilometers_per_second).toFixed(2) : 'N/A'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Miss Distance (km):</span> {approach.miss_distance ? parseInt(approach.miss_distance.kilometers).toLocaleString() : 'N/A'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Orbiting Body:</span> {approach.orbiting_body || 'N/A'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">NASA JPL URL:</span> <a href={selectedNEO.nasa_jpl_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">{selectedNEO.nasa_jpl_url}</a>
            </div>
            {selectedNEO.close_approach_data && selectedNEO.close_approach_data.length > 1 && (
              <details className="mb-2">
                <summary className="font-semibold cursor-pointer">Other Close Approaches</summary>
                <ul className="list-disc ml-5 mt-1">
                  {selectedNEO.close_approach_data.slice(1).map((ca, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">Date:</span> {ca.close_approach_date_full || ca.close_approach_date}, <span className="font-semibold">Miss Distance (km):</span> {parseInt(ca.miss_distance.kilometers).toLocaleString()}, <span className="font-semibold">Velocity (km/s):</span> {parseFloat(ca.relative_velocity.kilometers_per_second).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loading message="Loading NEO..." />;
  }

  if (error) {
    return <ErrorMessage title="Error loading NEO" error={error} onRetry={() => fetchNEO()} />;
  }

  return (
    <div className="bg-neutral-950 h-full w-full lg:p-6 p-3 mt-16 lg:mt-0 rounded-2xl flex flex-col gap-4 lg:flex-row">
      <div className="w-full lg:w-3/4">
        {neoObjects.length > 0 ? (
          renderNeoList()
        ) : (
          neoFeedData && !loading && (
            <div className="bg-neutral-900 p-3 lg:p-6 h-full rounded-lg flex items-center justify-center">
              <p className="text-zinc-300 text-center">
                No Near Earth Objects found for the selected date(s).
                <br />
                The API only supports a maximum of 7 days range.
              </p>
            </div>
          )
        )}
        
      </div>
      <div className="bg-neutral-900 p-3 lg:p-6 w-full lg:w-1/4 rounded-lg space-y-4">
        <h1 className="text-2xl font-bold text-zinc-200">NEO Options</h1>
        <DateRangeForm
          specificDate={specificDate}
          startDate={startDate}
          endDate={endDate}
          onSpecificDateChange={e => { setSpecificDate(e.target.value); setStartDate(""); setEndDate(""); }}
          onStartDateChange={e => { setStartDate(e.target.value); setSpecificDate(""); }}
          onEndDateChange={e => { setEndDate(e.target.value); setSpecificDate(""); }}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Fetch NEO"
        />
        <div className="pt-4 border-t border-zinc-700">
          <button 
            onClick={() => fetchNEO()}
            className="bg-zinc-700 w-full py-2 rounded-lg cursor-pointer font-medium hover:bg-zinc-600 transition-colors text-zinc-200"
          >
            Today's NEOs
          </button>
        </div>
      </div>
      {renderModal()}
    </div>
  );
};

export default NEO;
