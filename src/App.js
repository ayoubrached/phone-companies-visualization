import React, { useState } from 'react';
import StackedBar from './components/StackedBar';
import FileUploader from './components/FileUploader';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);

  // Handle parsed data from file upload
  const handleDataParsed = parsedData => {
    setData(parsedData); // Update the state with parsed data
  };

  return (
    <div className="graphs">
      <h1 class="header mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Phone Company Visualization</span></h1>
      <FileUploader onDataParsed={handleDataParsed} />
      {data.length > 0 ? (
        <StackedBar data={data} />
      ) : (
        <p class="mb-3 text-black dark:text-black">Please upload a CSV file to generate the visualization.</p>
      )}
    </div>
  );
};

export default App;
