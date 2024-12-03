import React, { useState } from 'react';
import StackedBar from './components/StackedBar';
import BarChart from './components/BarChart';
import FileUploader from './components/FileUploader';
import './App.css';

const App = () => {
  const [stackedBarData, setStackedBarData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Handle parsed data from file upload
  const handleDataParsed = ({ stackedBarData, barChartData }) => {
    setStackedBarData(stackedBarData); // Update state for stacked bar chart
    setBarChartData(barChartData); // Update state for bar chart
  };

  return (
    <div className="graphs">
      <h1 className="header mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Phone Company Visualization</span>
      </h1>
      <FileUploader onDataParsed={handleDataParsed} />
      
      {stackedBarData.length > 0 && (
        <div className="visualization-section">
          <h2 className="chart-title mb-4 text-xl font-bold text-gray-900 dark:text-white">Stacked Bar Chart</h2>
          <StackedBar data={stackedBarData} />
        </div>
      )}

      {barChartData.length > 0 && (
        <div className="visualization-section">
          <h2 className="chart-title mb-4 text-xl font-bold text-gray-900 dark:text-white">Bar Chart</h2>
          <BarChart data={barChartData} />
        </div>
      )}
    </div>
  );
};

export default App;
