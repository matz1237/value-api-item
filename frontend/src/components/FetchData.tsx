//frontend/src/components/FetchData.tsx

import React, { useEffect, useState } from 'react';

const FetchData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch the data from your backend
    fetch('/some-endpoint')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty dependency array to run on component mount

  return (
    <div>
      {data ? <p>{JSON.stringify(data)}</p> : <p>Loading...</p>}
    </div>
  );
};

export default FetchData;
