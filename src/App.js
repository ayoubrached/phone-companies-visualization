import React, { useState } from 'react';
import StackedBar from './components/StackedBar';
import BarChart from './components/BarChart';
import FileUploader from './components/FileUploader';
import './App.css';
import PixelsVsAvgPriceScatterPlot from "./components/PixelsVsAvgPriceScatterPlot";

const App = () => {
    const [stackedBarData, setStackedBarData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [scatterPlotData, setScatterPlotData] = useState([]);

    // Handle parsed data from file upload
    const handleDataParsed = ({ stackedBarData, barChartData, scatterPlotData }) => {
        setStackedBarData(stackedBarData); // Update state for stacked bar chart
        setBarChartData(barChartData); // Update state for bar chart
        setScatterPlotData(scatterPlotData); // Update state for scatter plot
    };

    return (
        <div className="graphs">
            <h1 className="header mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Phone Company Visualization
        </span>
            </h1>
            <FileUploader onDataParsed={handleDataParsed} />

            {stackedBarData.length > 0 && barChartData.length > 0 && scatterPlotData.length > 0 && (
                <div className="visualization-section">
                    <div className="flex flex-row w-full">
                        <div className="stacked-bar-chart flex-1">
                            <StackedBar data={stackedBarData} />
                        </div>
                        <div className="bar-chart flex-1">
                            <BarChart data={barChartData} />
                        </div>
                    </div>

                    <div className="scatter-plot mt-5">
                        <PixelsVsAvgPriceScatterPlot data={scatterPlotData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
