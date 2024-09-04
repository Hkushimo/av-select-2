
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSwipeable } from 'react-swipeable';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1p5EUNGud_FE5gvlYZqr72IhifttLZEc-FNgwFbR0m1U/pubhtml';

    axios.get(sheetUrl)
      .then(response => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');
        const rows = doc.querySelectorAll('table tbody tr');

        const parsedData = Array.from(rows).slice(1).map(row => {
          const cols = row.querySelectorAll('td');
          return {
            name: cols[0]?.innerText.trim(),
            position: cols[1]?.innerText.trim(),
            city: cols[2]?.innerText.trim(),
            state: cols[3]?.innerText.trim(),
            contactPhone: cols[4]?.innerText.trim(),
            contactEmail: cols[5]?.innerText.trim(),
            reviewLink: cols[6]?.innerText.trim(),
            rating: cols[7]?.innerText.trim(),
            imageUrl: cols[8]?.innerText.trim(),
          };
        });
        setData(parsedData);
      })
      .catch(error => console.error('Error fetching the Google Sheets data:', error));
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIndex((prevIndex) => (prevIndex + 1) % data.length),
    onSwipedRight: () => setIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length),
  });

  if (data.length === 0) return <p>Loading...</p>;

  const current = data[index];

  return (
    <div {...handlers} className="swipe-container">
      <div className="card">
        <img src={current.imageUrl || 'default-image.jpg'} alt={`${current.name}'s photo`} />
        <h2>{current.name}</h2>
        <p><strong>Position:</strong> {current.position}</p>
        <p><strong>City:</strong> {current.city}</p>
        <p><strong>State:</strong> {current.state}</p>
        <p><strong>Contact Phone:</strong> {current.contactPhone}</p>
        <p><strong>Contact Email:</strong> {current.contactEmail}</p>
        <p><strong>Rating:</strong> {current.rating}</p>
        {current.reviewLink && (
          <a href={current.reviewLink} target="_blank" rel="noopener noreferrer" className="review-button">
            Leave Review
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
