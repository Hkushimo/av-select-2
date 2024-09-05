import React, { useEffect, useState } from 'react';

function App() {
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/data-cwmvsge/endpoint/data/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'nJgmyQpQWkjZlc9ukVz2VLMmG2YFeMCkLV6YZO8A1g1J9PnbZkMPLbF5wqhWTvyL',
        },
        body: JSON.stringify({
          collection: 'technicians',
          database: 'av_select',
          dataSource: 'Cluster0',
          filter: {},
        }),
      });
      const data = await response.json();
      setTechnicians(data.documents);
    };

    fetchTechnicians();
  }, []);

  return (
    <div className="app">
      <h1>AV Technicians</h1>
      <div className="cards">
        {technicians.map(tech => (
          <div key={tech._id} className="card">
            <h2>{tech.name}</h2>
            <p>{tech.position}</p>
            <p>{tech.city}, {tech.state}</p>
            <p>{tech.skills.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
