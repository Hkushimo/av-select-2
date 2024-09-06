import React, { useState, useEffect } from 'react';
import CardSwiper from './CardSwiper';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOZ_RmjKIIyx_EeTdU-AyzdgMiRExLAHyx6tiJMfu1MnZ-mQRCmueAzEiVtcT9KJexmX0k7NjTzv4g/pubhtml'
        );
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const tableRows = doc.querySelectorAll('table tbody tr');

        const extractedData = Array.from(tableRows).map(row => {
          const cells = row.querySelectorAll('td');
          return Array.from(cells).map(cell => cell.innerText);
        });

        setData(extractedData);
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      {data.length > 0 ? (
        <CardSwiper data={data} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default App;
