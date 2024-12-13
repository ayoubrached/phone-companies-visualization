import React, { useState } from 'react';
import StackedBar from './components/StackedBar';
import BarChart from './components/BarChart';
import Foldable from './components/Foldable'; // Import the Foldable component
import FileUploader from './components/FileUploader';
import './App.css';

const App = () => {
  const [stackedBarData, setStackedBarData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [foldableData, setFoldableData] = useState([]);

  // Handle parsed data from file upload
  const handleDataParsed = ({ stackedBarData, barChartData, foldableData }) => {
    setStackedBarData(stackedBarData); // Update state for stacked bar chart
    setBarChartData(barChartData); // Update state for bar chart
    setFoldableData(foldableData); // Update state for foldable stacked bar chart
  };

  return (
    <div className="graphs">
      <h1 className="header mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Phone Company Visualization
        </span>
      </h1>
      
      <FileUploader onDataParsed={handleDataParsed} />

      {stackedBarData.length > 0 && barChartData.length > 0 && foldableData.length > 0 &&  (
        <div className="visualization-section">
          <div className="flex flex-row w-full">
            <div className="stacked-bar-chart">
              <StackedBar data={stackedBarData} />
            </div>
            <div className="bar-chart">
              <BarChart data={barChartData} />
            </div>
            <div className="foldable-chart">
              <Foldable data={foldableData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
