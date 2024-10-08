import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get('/api/v1/hello')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(() => {
        setMessage('Error fetching message');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
