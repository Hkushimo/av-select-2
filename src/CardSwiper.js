import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

// Modal component for filter inputs
const FilterModal = ({ show, handleClose, positionFilter, setPositionFilter, cityFilter, setCityFilter, stateFilter, setStateFilter }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Filter Results</h3>
        <div className="filters">
          <input
            type="text"
            placeholder="Filter by Position"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value.trim())}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by City"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value.trim())}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by State"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value.trim())}
            className="filter-input"
          />
        </div>
        <button className="close-button" onClick={handleClose}>Close Filters</button>
      </div>
    </div>
  );
};

const CardSwiper = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false); // Track fade animation

  // State for search filters
  const [positionFilter, setPositionFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  // Modal visibility state
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Define the headers for the data fields
  const headers = ['Name', 'Position(s)', 'City', 'State', 'Phone', 'Email', 'Rating', 'Review Link', 'Photo'];

  const handleNext = () => {
    setIsFading(true); // Start fading out
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === filteredData.length - 1 ? 0 : prevIndex + 1));
      setIsFading(false); // Fade back in after changing the card
    }, 300); // Delay for fade-out effect
  };

  const handlePrev = () => {
    setIsFading(true); // Start fading out
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? filteredData.length - 1 : prevIndex - 1));
      setIsFading(false); // Fade back in after changing the card
    }, 300); // Delay for fade-out effect
  };

  const isImageUrl = (url) => url.match(/\.(jpeg|jpg|gif|png)$/) !== null;

  // Filter the data based on search inputs (Partial match)
  const filteredData = data.slice(1).filter((item) => {
    const position = item[2]?.toLowerCase().trim() || ''; // Correct index for position (index 2)
    const city = item[3]?.toLowerCase().trim() || '';     // Correct index for city (index 3)
    const state = item[4]?.toLowerCase().trim() || '';    // Correct index for state (index 4)

    return (
      (!positionFilter || position.includes(positionFilter.toLowerCase())) &&
      (!cityFilter || city.includes(cityFilter.toLowerCase())) &&
      (!stateFilter || state.includes(stateFilter.toLowerCase()))
    );
  });

  // Ensure that currentIndex is valid within the filtered data range
  useEffect(() => {
    if (currentIndex >= filteredData.length) {
      setCurrentIndex(0); // Reset index if the filtered data set is smaller
    }
  }, [filteredData, currentIndex]);

  const renderData = (item) => {
    let imageElement = null;
    let linkButton = null;
    const otherText = [];

    item.slice(1).forEach((cell, index) => {
      const label = headers[index];  // Use the headers array here

      // Render image if it's a valid URL
      if (isImageUrl(cell)) {
        imageElement = (
          <div key={`image-${index}`} style={{ marginBottom: '10px', textAlign: 'center' }}>
            <img
              src={cell}
              alt="Profile"
              style={{
                width: '60%',
                height: '60%',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </div>
        );
      }
      // Render link as a button, update text to "Leave Review"
      else if (cell.startsWith('http')) {
        linkButton = (
          <div key={`link-${index}`} style={{ marginTop: '10px' }}>
            <a href={cell} target="_blank" rel="noopener noreferrer">
              <button className="link-button">Leave Review</button>
            </a>
          </div>
        );
      }
      // Render regular text
      else if (index !== 0) {
        otherText.push(
          <p key={index}>
            <strong>{label}:</strong> {cell}
          </p>
        );
      }
    });

    return (
      <div>
        {imageElement}
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px' }}>
          {item[1]} {/* Display name */}
        </h2>
        {otherText}
        {linkButton}
      </div>
    );
  };

  // Swipe handlers to only trigger fade
  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Enable mouse swipe
  });

  return (
    <div className="filter-container">
      {/* Button to trigger Filter Modal */}
      <button className="open-filters" onClick={() => setShowFilterModal(true)}>
        Filters
      </button>

      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        handleClose={() => setShowFilterModal(false)}
        positionFilter={positionFilter}
        setPositionFilter={setPositionFilter}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
      />

      {/* Swiper */}
      <div {...handlers} className="swiper-container">
        {filteredData.length > 0 ? (
          <div
            className={`card`}
            style={{
              opacity: isFading ? 0 : 1, // Fade effect
              transition: 'opacity 0.3s ease' // Smooth fade
            }}
          >
            {renderData(filteredData[currentIndex])}
          </div>
        ) : (
          <p>No results match your search.</p>
        )}
      </div>
    </div>
  );
};

export default CardSwiper;
